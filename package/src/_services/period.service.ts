import apiClient from '@/_libs/api/client';
import {
    Period, CreatePeriodRequest, UpdatePeriodRequest, PeriodsResponseSchema,
    PeriodSchema
} from '@/_models/period.model';

export const periodService = {
    async getAll(): Promise<Period[]> {
        const response = await apiClient.get('/periods/');
        return PeriodsResponseSchema.parse(response.data).results;
    },

    async toggle(id: number): Promise<boolean> {
        const response = await apiClient.post(`/periods/${id}/toggle/`, {});
        return response.data.closed;
    },

    async getById(id: number): Promise<Period> {
        const response = await apiClient.get(`/periods/${id}/`);
        return PeriodSchema.parse(response.data);
    },

    async create(data: CreatePeriodRequest): Promise<Period> {
        const response = await apiClient.post('/periods/', data);
        return PeriodSchema.parse(response.data);
    },

    async update(id: number, data: UpdatePeriodRequest): Promise<Period> {
        const response = await apiClient.put(`/periods/${id}/`, data);
        return PeriodSchema.parse(response.data);
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/periods/${id}/`);
    },
};