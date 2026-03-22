import { z } from 'zod';

// Schemas
export const AccountSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    sign: z.number(),
    account_type: z.string(),
    parent: z.number().nullable(),
});

// Types
export type Account = z.infer<typeof AccountSchema>;
