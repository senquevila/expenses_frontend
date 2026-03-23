import { z } from 'zod';
import { MoneySchema } from '@/_models/money.model';

export const SUBSCRIPTION_TYPES = [
    'MOVIES',
    'MUSIC',
    'BOOKS',
    'OTHER',
] as const;

export const SubscriptionSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    monthly_payment: MoneySchema,
    subscription_type: z.enum(SUBSCRIPTION_TYPES),
    is_active: z.boolean(),
    currency: z.number().int().positive(),
});

export const SubscriptionsResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(SubscriptionSchema),
});

export const CreateSubscriptionRequestSchema = SubscriptionSchema.omit({ id: true });

export const UpdateSubscriptionRequestSchema = CreateSubscriptionRequestSchema.partial();

// Types
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type CreateSubscriptionRequest = z.infer<typeof CreateSubscriptionRequestSchema>;
export type UpdateSubscriptionRequest = z.infer<typeof UpdateSubscriptionRequestSchema>;
