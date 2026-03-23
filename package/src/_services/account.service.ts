import apiClient from '@/_libs/api/client';
import { Account, AccountSchema, AccountsResponseSchema } from '@/_models/account.model';

export const accountService = {
    async getAll(): Promise<Account[]> {
        const response = await apiClient.get('accounts/');
        return AccountsResponseSchema.parse(response.data).results;
    },

    async getById(id: number): Promise<Account> {
        const response = await apiClient.get(`accounts/${id}/`);
        return AccountSchema.parse(response.data);
    },
};
