import { z } from 'zod';
import { AccountSchema } from '@/_models/account.model';
import { PeriodSchema } from '@/_models/period.model';


// Schemas
export const TransactionSchema = z.object({
    id: z.number().int().positive(),
    period: PeriodSchema,
    account: AccountSchema,
    currency: z.number().int().positive(),
    description: z.string().nullable(),
    amount: z.coerce.number(),
    local_amount: z.coerce.number(),
    payment_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    created: z.string(),
    modified: z.string(),
    identifier: z.string().nullable(),
    upload: z.unknown().nullable(),
});

export const TransactionsResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(TransactionSchema),
});

export const CreateTransactionRequestSchema = TransactionSchema.omit({ id: true, created: true, modified: true, period: true, account: true, amount: true, local_amount: true }).extend({
    period: z.number().int().positive(),
    account: z.number().int().positive(),
    amount: z.number(),
    local_amount: z.number(),
});

export const UpdateTransactionRequestSchema = CreateTransactionRequestSchema.partial();


// Types
export type Transaction = z.infer<typeof TransactionSchema>;

export type CreateTransactionRequest = z.infer<typeof CreateTransactionRequestSchema>;

export type UpdateTransactionRequest = z.infer<typeof UpdateTransactionRequestSchema>;