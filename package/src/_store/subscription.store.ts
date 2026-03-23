import { create } from 'zustand';
import { toast } from 'sonner';

import { Subscription, CreateSubscriptionRequest, UpdateSubscriptionRequest } from '@/_models/subscription.model';
import { subscriptionService } from '@/_services/subscription.service';

interface SubscriptionState {
    subscriptions: Subscription[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchAll: () => Promise<void>;
    add: (data: CreateSubscriptionRequest) => Promise<void>;
    edit: (id: number, data: UpdateSubscriptionRequest) => Promise<void>;
    toggle: (id: number) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
    subscriptions: [],
    loading: false,
    error: null,

    fetchAll: async () => {
        set({ loading: true, error: null });
        try {
            const data = await subscriptionService.getAll();
            set({ subscriptions: data });
        } catch {
            toast.error('Failed to fetch subscriptions');
        } finally {
            set({ loading: false });
        }
    },

    add: async (data) => {
        set({ loading: true, error: null });
        try {
            const newSub = await subscriptionService.create(data);
            set((state) => ({ subscriptions: [...state.subscriptions, newSub] }));
            toast.success('Subscription created');
        } catch {
            toast.error('Failed to add subscription');
        } finally {
            set({ loading: false });
        }
    },

    edit: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedSub = await subscriptionService.update(id, data);
            set((state) => ({
                subscriptions: state.subscriptions.map((s) => (s.id === id ? updatedSub : s)),
            }));
            toast.success('Subscription updated');
        } catch {
            toast.error('Failed to update subscription');
        } finally {
            set({ loading: false });
        }
    },

    toggle: async (id) => {
        set({ loading: true, error: null });
        try {
            const updatedSub = await subscriptionService.toggle(id);
            set((state) => ({
                subscriptions: state.subscriptions.map((s) => (s.id === id ? updatedSub : s)),
            }));
            toast.success(`Subscription marked as ${updatedSub.is_active ? 'active' : 'inactive'}`);
        } catch {
            toast.error('Failed to update subscription');
        } finally {
            set({ loading: false });
        }
    },
}));
