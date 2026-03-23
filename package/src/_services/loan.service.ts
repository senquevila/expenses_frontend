import apiClient from "@/_libs/api/client";

import {
    Loan, CreateLoanRequest, UpdateLoanRequest,
    LoansResponseSchema, LoanSchema
} from "@/_models/loan.model";

export const loanService = {
    async getAll(): Promise<Loan[]> {
        const response = await apiClient.get('loans/');
        return LoansResponseSchema.parse(response.data).results;
    },

    async getById(id: number): Promise<Loan> {
        const response = await apiClient.get(`loans/${id}/`);
        return LoanSchema.parse(response.data);
    },

    async create(data: CreateLoanRequest): Promise<Loan> {
        const response = await apiClient.post('loans/', data);
        return LoanSchema.parse(response.data);
    },

    async update(id: number, data: UpdateLoanRequest): Promise<Loan> {
        const response = await apiClient.put(`loans/${id}/`, data);
        return LoanSchema.parse(response.data);
    },

    async toggle(id: number): Promise<Loan> {
        const response = await apiClient.post(`loans/${id}/toggle/`);
        return LoanSchema.parse(response.data);
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`loans/${id}/`);
    },
};
