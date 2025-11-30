// GLOBAL TYPES
import z from "zod";

// =============== LAPORAN SECTION ==================
export const jenis_bisnis = [
  "kendaraan",
  "health",
  "life",
  "property",
  "marine",
] as const;
export const JENIS_BISNIS = z.enum(jenis_bisnis);

export type JenisBisnis = z.infer<typeof JENIS_BISNIS>;

export const jenis_kendaraan = ["mobil", "motor"] as const;
export type JenisKendaraan = z.infer<typeof JENIS_KENDARAAN>;
export const JENIS_KENDARAAN = z.enum(jenis_kendaraan);

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

// ==================== SEARCH PARAMS ====================

export type RawSearchParams = Record<string, string | string[] | undefined>;

export const SearchParamsSchema = z.object({
  search: z.string().optional().nullable().transform(val => val || null),
  page: z.coerce.number().int().optional().nullable().transform(val => val || 1),
  size: z.coerce.number().int().optional().nullable().transform(val => val || 10),
  date_from: z.string().optional().nullable().transform(val => val || null),
  date_to: z.string().optional().nullable().transform(val => val || null),
  status: z.string().optional().nullable().transform(val => val || null),
});

export type SearchParamsProps = z.infer<typeof SearchParamsSchema>;

// ===================== FORM PARAMS =======================