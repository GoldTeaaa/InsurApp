// features/perusahaan/query.ts
import { z } from "zod";

/* ====================== EXISTING (kept) ====================== */

// Allowed sort keys (mirror your SQL CASEs)
export const sortEnum = z.enum([
  "created_desc",
  "created_asc",
  "name_asc",
  "name_desc",
  "email_asc",
  "email_desc",
]);
export type PerusahaanSort = z.infer<typeof sortEnum>;

// URL -> clean query
export const perusahaanQuerySchema = z.object({
  q: z
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
    .pipe(sortEnum),
});
export type PerusahaanQuery = z.infer<typeof perusahaanQuerySchema>;

// List RPC params
export const perusahaanListParamsSchema = z.object({
  p_search: z.string(),
  p_page: z.number().int().min(1),
  p_page_size: z.number().int().min(1).max(50),
  p_sort: sortEnum,
});

// One list row
export const perusahaanRowSchema = z.object({
  id: z.string().uuid(),
  nama: z.string(),
  email: z.string().email().nullable().optional(),
  alamat: z.string().nullable().optional(),
  kontak_1: z.string().nullable().optional(),
  kontak_2: z.string().nullable().optional(),
  created_at: z.string(),      // keep as ISO string
  updated_at: z.string(),
  total_count: z.coerce.number(), // bigint → number
});
export const perusahaanRowsSchema = z.array(perusahaanRowSchema);
export type PerusahaanRow = z.infer<typeof perusahaanRowSchema>;

/* ====================== NEW (reusable primitives) ====================== */

export const nonEmpty3 = z.string().trim().min(3, "Nama wajib diisi (min 3 karakter)");
export const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

export const optionalEmail = z.preprocess(
  (v) => {
    if (typeof v !== "string") return v;
    const s = v.trim();
    return s === "" ? null : s.toLowerCase();
  },
  z.string().email("Format email tidak valid").nullable().optional()
);

/* ====================== NEW (base reusable field set) ====================== */

export const perusahaanFieldBaseSchema = z.object({
  nama: nonEmpty3,
  email: optionalEmail,
  alamat: optionalText,
  kontak_1: optionalText,
  kontak_2: optionalText,
});

/* ====================== NEW (Create) ====================== */

// 1) Form input (UI)
export const perusahaanCreateFormSchema = perusahaanFieldBaseSchema;
export type PerusahaanCreateForm = z.infer<typeof perusahaanCreateFormSchema>;

// 2) RPC params (exact SQL signature)
export const perusahaanCreateRpcParamsSchema = z.object({
  p_nama: nonEmpty3,
  p_email: optionalEmail,
  p_alamat: optionalText,
  p_kontak_1: optionalText,
  p_kontak_2: optionalText,
});
export type PerusahaanCreateParams = z.infer<typeof perusahaanCreateRpcParamsSchema>;

// 3) Zod-powered mapper: Form → RPC params
export const perusahaanCreateToRpcSchema = perusahaanCreateFormSchema
  .transform((v) => ({
    p_nama: v.nama.trim(),
    p_email: v.email ?? null,
    p_alamat: v.alamat ?? null,
    p_kontak_1: v.kontak_1 ?? null,
    p_kontak_2: v.kontak_2 ?? null,
  }))
  .pipe(perusahaanCreateRpcParamsSchema);

// 4) RPC result
export const perusahaanCreateResultSchema = z.object({
  id: z.string().uuid(),
  nama_asuransi: z.string(),
});
export const perusahaanCreateResultArraySchema = z.array(perusahaanCreateResultSchema).min(1);
export type PerusahaanCreateResult = z.infer<typeof perusahaanCreateResultSchema>;

// ====================== PREFILL UPDATE TABLE SCHEMA ================

export const perusahaanPrefillUpdateSchema = z.object({
  id: z.string().uuid(),
  nama: z.string(),
  email: z.string().email().nullable().optional(),
  alamat: z.string().nullable().optional(),
  kontak_1: z.string().nullable().optional(),
  kontak_2: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type PerusahaanPrefillUpdate = z.infer<typeof perusahaanPrefillUpdateSchema>;

/* ====================== (Optional) UPDATE later ====================== */
export const perusahaanUpdateFormSchema = z.object({
  id: z.string().uuid(),
  nama: nonEmpty3,
  email: optionalEmail,
  alamat: optionalText,
  kontak_1: optionalText,
  kontak_2: optionalText,
});

export type PerusahaanUpdateFormValues = z.infer<typeof perusahaanUpdateFormSchema>;

export const perusahaanUpdateRpcParamsSchema = z.object({
  p_id: z.string().uuid(),
  p_nama: nonEmpty3.optional(),
  p_email: optionalEmail,
  p_alamat: optionalText,
  p_kontak_1: optionalText,
  p_kontak_2: optionalText,
});

export type PerusahaanUpdateParams = z.infer<typeof perusahaanUpdateRpcParamsSchema>;

