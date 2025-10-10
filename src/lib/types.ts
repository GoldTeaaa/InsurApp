import z from "zod";

export type ActionReturnState<TSuccessData = undefined> =
  | { success: true; message: string; data?: TSuccessData }
  | { success: false; message: string; errors?: Record<string, string[] | undefined> };
  

export const tableQuerySchema = z.object({
  search: z
    .union([z.string(), z.array(z.string()), z.undefined()])
    .transform((v) => (Array.isArray(v) ? v[0] : v ?? ""))
    .transform((s) => s.trim()),
  page: z
    .union([z.string(), z.array(z.string()), z.undefined()])
    .transform((v) => (Array.isArray(v) ? v[0] : v))
    .transform((s) => {
      const n = Number(s ?? 1);
      return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
    }),
  sort: z
    .union([z.string(), z.array(z.string()), z.undefined()])
    .transform((v) => (Array.isArray(v) ? v[0] : v ?? "created_desc"))
    // .pipe(sortEnum),
});
export type tableQuery = z.infer<typeof tableQuerySchema>;