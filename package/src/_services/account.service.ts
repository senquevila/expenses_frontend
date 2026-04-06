import apiClient from '@/_libs/api/client';
import { Account, AccountSchema, AccountsResponseSchema, CreateAccountRequest, UpdateAccountRequest } from '@/_models/account.model';

export const accountService = {
    async getAll(): Promise<Account[]> {
        const response = await apiClient.get('accounts/');
        return AccountsResponseSchema.parse(response.data).results;
    },

    async getById(id: number): Promise<Account> {
        const response = await apiClient.get(`accounts/${id}/`);
        return AccountSchema.parse(response.data);
    },

    async create(data: CreateAccountRequest): Promise<void> {
        await apiClient.post('accounts/', data);
    },

    async update(id: number, data: UpdateAccountRequest): Promise<void> {
        await apiClient.put(`accounts/${id}/`, data);
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`accounts/${id}/`);
    },
};
