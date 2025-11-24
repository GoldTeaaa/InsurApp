// GLOBAL TYPES
import z from "zod";

// =============== LAPORAN SECTION ==================
export const JENIS_BISNIS = z.enum([
  "kendaraan",
  "health",
  "life",
  "property",
  "marine",
]);

export const JENIS_COAS = z.enum(["coas", "non-coas"]);

export const CARA_BAYAR = [
  "cash", 
  "transfer", 
  "virtual account"
] as const;

export const STATUS_BAYAR = z.enum([
  "unpaid", 
  "partially_paid", 
  "paid"
]);

export const AGING_RANGE = [
    "0-30",
    "31-60",
    "61-90",
    ">90",
] as const;

// ===================================================

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

export type TableParams = {
  search?: string;
  page?: number;
  size?: number;
  status?: string;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;