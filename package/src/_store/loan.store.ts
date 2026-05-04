import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

import {
  Loan,
  LoanSummary,
  CreateLoanRequest,
  UpdateLoanRequest,
} from "@/_models/loan.model";
import { loanService } from "@/_services/loan.service";

const SUMMARY_TTL_MS = 24 * 60 * 60 * 1000;

interface LoanState {
  loans: Loan[];
  summary: LoanSummary | null;
  summaryFetchedAt: number | null;
  loading: boolean;
  summaryLoading: boolean;
  error: string | null;

  // Actions
  fetchAll: (isActive?: boolean) => Promise<void>;
  fetchSummary: (force?: boolean) => Promise<void>;
  add: (data: CreateLoanRequest) => Promise<void>;
  edit: (id: number, data: UpdateLoanRequest) => Promise<void>;
  toggle: (id: number) => Promise<void>;
}

export const useLoanStore = create<LoanState>()(
  persist(
    (set, get) => ({
      loans: [],
      summary: null,
      summaryFetchedAt: null,
      loading: false,
      summaryLoading: false,
      error: null,

      fetchSummary: async (force = false) => {
        const { summary, summaryFetchedAt } = get();
        const isStale =
          !summaryFetchedAt || Date.now() - summaryFetchedAt > SUMMARY_TTL_MS;
        if (!force && summary && !isStale) return;

        set({ summaryLoading: true });
        try {
          const data = await loanService.getSummary();
          set({ summary: data, summaryFetchedAt: Date.now() });
        } catch (err) {
          console.error("Failed to fetch loan summary:", err);
          toast.error("Failed to fetch loan summary");
        } finally {
          set({ summaryLoading: false });
        }
      },

      fetchAll: async (isActive?: boolean) => {
        set({ loading: true, error: null });
        try {
          const data = await loanService.getAll(isActive);
          set({ loans: data });
        } catch {
          toast.error(
            "Failed to fetch loans. Please check your connection and try again.",
          );
        } finally {
          set({ loading: false });
        }
      },

      add: async (data) => {
        set({ loading: true, error: null });
        try {
          const newLoan = await loanService.create(data);
          set((state) => ({ loans: [...state.loans, newLoan] }));
          toast.success("Loan created");
        } catch {
          toast.error("Failed to add loan");
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
          toast.success("Loan updated");
        } catch {
          toast.error("Failed to update loan");
        } finally {
          set({ loading: false });
        }
      },

      toggle: async (id) => {
        set({ loading: true, error: null });
        try {
          const isActive = await loanService.toggle(id);
          set((state) => ({
            loans: state.loans.map((l) =>
              l.id === id ? { ...l, is_active: isActive } : l,
            ),
          }));
          toast.success(`Loan marked as ${isActive ? "active" : "inactive"}`);
        } catch {
          toast.error("Failed to update loan");
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "loan-summary-cache",
      partialize: (state) => ({
        summary: state.summary,
        summaryFetchedAt: state.summaryFetchedAt,
      }),
    },
  ),
);
