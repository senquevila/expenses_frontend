import { create } from 'zustand';
import { toast } from 'sonner';

import { Transaction, CreateTransactionRequest, UpdateTransactionRequest } from '@/_models/transaction.model';
import { transactionService } from '@/_services/transaction.service';

interface TransactionState {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    
    // Actions
    fetchAll: () => Promise<void>;
    add: (data: CreateTransactionRequest) => Promise<void>;
    edit: (id: number, data: UpdateTransactionRequest) => Promise<void>;
    remove: (id: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
    transactions: [],
    loading: false,
    error: null,

    fetchAll: async () => {
        set({ loading: true, error: null });
        try {
            const data = await transactionService.getAll();
            set({ transactions: data });
        } catch {
            toast.error('Failed to fetch transactions');
        } finally {
            set({ loading: false });
        }
    },

    add: async (data) => {
        set({ loading: true, error: null });
        try {
            const newTransaction = await transactionService.create(data);
            set((state) => ({ transactions: [...state.transactions, newTransaction] }));
            toast.success('Transaction created');
        } catch {
            toast.error('Failed to add transaction');
        } finally {
            set({ loading: false });
        }
    },

    edit: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedTransaction = await transactionService.update(id, data);
            set((state) => ({
                transactions: state.transactions.map((t) => (t.id === id ? updatedTransaction : t)),
            }));
            toast.success('Transaction updated');
        } catch {
            toast.error('Failed to update transaction');
        } finally {
            set({ loading: false });
        }
    },

    remove: async (id) => {
        set({ loading: true, error: null });
        try {
            await transactionService.delete(id);
            set((state) => ({
                transactions: state.transactions.filter((t) => t.id !== id),
            }));
            toast.success('Transaction deleted');
        } catch {
            toast.error('Failed to delete transaction');
        } finally {
            set({ loading: false });
        }
    },
}));