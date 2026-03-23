import { create } from 'zustand';
import { toast } from 'sonner';

import { Loan, CreateLoanRequest, UpdateLoanRequest } from '@/_models/loan.model';
import { loanService } from '@/_services/loan.service';

interface LoanState {
    loans: Loan[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchAll: () => Promise<void>;
    add: (data: CreateLoanRequest) => Promise<void>;
    edit: (id: number, data: UpdateLoanRequest) => Promise<void>;
    toggle: (id: number) => Promise<void>;
}

export const useLoanStore = create<LoanState>((set) => ({
    loans: [],
    loading: false,
    error: null,

    fetchAll: async () => {
        set({ loading: true, error: null });
        try {
            const data = await loanService.getAll();
            set({ loans: data });
        } catch {
            toast.error('Failed to fetch loans. Please check your connection and try again.');
        } finally {
            set({ loading: false });
        }
    },

    add: async (data) => {
        set({ loading: true, error: null });
        try {
            const newLoan = await loanService.create(data);
            set((state) => ({ loans: [...state.loans, newLoan] }));
            toast.success('Loan created');
        } catch {
            toast.error('Failed to add loan');
        } finally {
            set({ loading: false });
        }
    },

    edit: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedLoan = await loanService.update(id, data);
            set((state) => ({
                loans: state.loans.map((l) => (l.id === id ? updatedLoan : l)),
            }));
            toast.success('Loan updated');
        } catch {
            toast.error('Failed to update loan');
        } finally {
            set({ loading: false });
        }
    },

    toggle: async (id) => {
        set({ loading: true, error: null });
        try {
            const updatedLoan = await loanService.toggle(id);
            set((state) => ({
                loans: state.loans.map((l) => (l.id === id ? updatedLoan : l)),
            }));
            toast.success(`Loan marked as ${updatedLoan.is_active ? 'active' : 'inactive'}`);
        } catch {
            toast.error('Failed to update loan');
        } finally {
            set({ loading: false });
        }
    },
}));
