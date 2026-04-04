import { create } from 'zustand';
import { toast } from 'sonner';
import { Account } from '@/_models/account.model';
import { accountService } from '@/_services/account.service';

interface AccountState {
    accounts: Account[];
    loading: boolean;

    fetchAll: () => Promise<void>;
}

export const useAccountStore = create<AccountState>((set) => ({
    accounts: [],
    loading: false,

    fetchAll: async () => {
        set({ loading: true });
        try {
            const data = await accountService.getAll();
            set({ accounts: data });
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
            toast.error('Failed to fetch accounts');
        } finally {
            set({ loading: false });
        }
    },
}));
