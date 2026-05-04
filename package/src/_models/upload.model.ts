import { z } from "zod";

const DimensionSchema = z.object({
  rows: z.number().int(),
  cols: z.number().int(),
});

const ParametersSchema = z.object({
  rows: z.object({
    start: z.number().int(),
    end: z.number().int(),
  }),
  cols: z.array(z.string()),
});

export const UploadSchema = z.object({
  id: z.number().int().positive(),
  created: z.string(),
  modified: z.string().nullable(),
  file: z.string().nullable(),
  data: z.unknown().nullable(),
  dimension: DimensionSchema,
  result: z.string().nullable(),
  parameters: ParametersSchema,
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
});

export const UploadsResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(UploadSchema),
});

export const CreateUploadRequestSchema = z.object({
  file: z.custom<File>((v) => v instanceof File, {
    message: "File is required",
  }),
  account_id: z.number().int().positive().optional(),
  row_start: z.number().int().nonnegative().optional(),
  row_end: z.number().int().nonnegative().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

// Types
export type Upload = z.infer<typeof UploadSchema>;
export type CreateUploadRequest = z.infer<typeof CreateUploadRequestSchema>;
