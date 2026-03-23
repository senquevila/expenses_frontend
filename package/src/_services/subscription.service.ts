import apiClient from "@/_libs/api/client";

import {
    Subscription, CreateSubscriptionRequest, UpdateSubscriptionRequest,
    SubscriptionsResponseSchema, SubscriptionSchema
} from "@/_models/subscription.model";

export const subscriptionService = {
    async getAll(): Promise<Subscription[]> {
        const response = await apiClient.get('subscriptions/');
        return SubscriptionsResponseSchema.parse(response.data).results;
    },

    async getById(id: number): Promise<Subscription> {
        const response = await apiClient.get(`subscriptions/${id}/`);
        return SubscriptionSchema.parse(response.data);
    },

    async create(data: CreateSubscriptionRequest): Promise<Subscription> {
        const response = await apiClient.post('subscriptions/', data);
        return SubscriptionSchema.parse(response.data);
    },

    async update(id: number, data: UpdateSubscriptionRequest): Promise<Subscription> {
        const response = await apiClient.put(`subscriptions/${id}/`, data);
        return SubscriptionSchema.parse(response.data);
    },

    async toggle(id: number): Promise<Subscription> {
        const response = await apiClient.post(`subscriptions/${id}/toggle/`);
        return SubscriptionSchema.parse(response.data);
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`subscriptions/${id}/`);
    },
};
