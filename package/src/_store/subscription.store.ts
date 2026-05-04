import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

import {
  Subscription,
  SubscriptionSummary,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from "@/_models/subscription.model";
import { subscriptionService } from "@/_services/subscription.service";

const SUMMARY_TTL_MS = 24 * 60 * 60 * 1000;

interface SubscriptionState {
  subscriptions: Subscription[];
  summary: SubscriptionSummary | null;
  summaryFetchedAt: number | null;
  loading: boolean;
  summaryLoading: boolean;
  error: string | null;

  // Actions
  fetchAll: (isActive?: boolean) => Promise<void>;
  fetchSummary: (force?: boolean) => Promise<void>;
  add: (data: CreateSubscriptionRequest) => Promise<void>;
  edit: (id: number, data: UpdateSubscriptionRequest) => Promise<void>;
  toggle: (id: number) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscriptions: [],
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
          const data = await subscriptionService.getSummary();
          set({ summary: data, summaryFetchedAt: Date.now() });
        } catch (err) {
          console.error("Failed to fetch subscription summary:", err);
          toast.error("Failed to fetch subscription summary");
        } finally {
          set({ summaryLoading: false });
        }
      },

      fetchAll: async (isActive?: boolean) => {
        set({ loading: true, error: null });
        try {
          const data = await subscriptionService.getAll(isActive);
          set({ subscriptions: data });
        } catch {
          toast.error("Failed to fetch subscriptions");
        } finally {
          set({ loading: false });
        }
      },

      add: async (data) => {
        set({ loading: true, error: null });
        try {
          const newSub = await subscriptionService.create(data);
          set((state) => ({ subscriptions: [...state.subscriptions, newSub] }));
          toast.success("Subscription created");
        } catch {
          toast.error("Failed to add subscription");
        } finally {
          set({ loading: false });
        }
      },

      edit: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const updatedSub = await subscriptionService.update(id, data);
          set((state) => ({
            subscriptions: state.subscriptions.map((s) =>
              s.id === id ? updatedSub : s,
            ),
          }));
          toast.success("Subscription updated");
        } catch {
          toast.error("Failed to update subscription");
        } finally {
          set({ loading: false });
        }
      },

      toggle: async (id) => {
        set({ loading: true, error: null });
        try {
          const isActive = await subscriptionService.toggle(id);
          set((state) => ({
            subscriptions: state.subscriptions.map((s) =>
              s.id === id ? { ...s, is_active: isActive } : s,
            ),
          }));
          toast.success(
            `Subscription marked as ${isActive ? "active" : "inactive"}`,
          );
        } catch {
          toast.error("Failed to update subscription");
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "subscription-summary-cache",
      partialize: (state) => ({
        summary: state.summary,
        summaryFetchedAt: state.summaryFetchedAt,
      }),
    },
  ),
);
