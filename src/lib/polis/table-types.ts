import { z } from "zod";

export const polisTableQuerySchema = z.object({
  search: z.string().trim().max(100).optional().nullable(),
  page: z.number().int().optional().default(1),
  size: z.number().int().default(10),
});

export type PolisTableQuery = z.infer<typeof polisTableQuerySchema>;
