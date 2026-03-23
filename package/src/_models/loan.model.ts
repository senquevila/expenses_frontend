import { z } from 'zod';
import { MoneySchema } from '@/_models/money.model';

// Schemas
export const LoanSchema = z.object({
    id: z.number().int().positive(),
    amount: MoneySchema,
    monthly_payment: MoneySchema,
    description: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    months: z.number().int().positive(),
    is_active: z.boolean(),
    bank: z.string(),
    currency: z.number().int().positive(),
});

export const LoansResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(LoanSchema),
});

export const CreateLoanRequestSchema = LoanSchema.omit({ id: true });

export const UpdateLoanRequestSchema = CreateLoanRequestSchema.partial();

// Types
export type Loan = z.infer<typeof LoanSchema>;
export type CreateLoanRequest = z.infer<typeof CreateLoanRequestSchema>;
export type UpdateLoanRequest = z.infer<typeof UpdateLoanRequestSchema>;
