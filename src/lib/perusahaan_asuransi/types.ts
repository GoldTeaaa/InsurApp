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

// List RPC params
export const perusahaanListParamsSchema = z.object({  
  p_search: z.string().optional().transform(val => val || undefined),
  p_page: z.number().int().min(1),
  p_size: z.number().int().min(1).max(50),
  p_sort: sortEnum.optional(),
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

export const perusahaanListSchema = z.array(perusahaanRowSchema);

export const perusahaanRpcPayloadSchema = z.object({
  rows: perusahaanListSchema,
  total_count: z.number(),
})
export type PerusahaanRow = z.infer<typeof perusahaanRowSchema>;
export type PerusahaanList = z.infer<typeof perusahaanListSchema>;
export type PerusahaanRpcPayload = z.infer<typeof perusahaanRpcPayloadSchema>;


/* ====================== NEW (base reusable field set) ====================== */

const nonEmpty3 = z.string().min(3, "Nama minimal 3 karakter");
const validEmail = z.string().email("Email tidak valid");
const nonEmptyKontak = z.string().min(5, "Kontak minimal 10 karakter");
const optionalText = z.string().optional().nullable();
const optionalEmail = validEmail.nullable().optional();

export const perusahaanFormSchema = z.object({
  nama: nonEmpty3,
  email: validEmail,
  alamat: optionalText,
  kontak_1: nonEmptyKontak,
  kontak_2: optionalText,
});

export type PerusahaanForm = z.infer<typeof perusahaanFormSchema>;

export const defaultPerusahaanForm: PerusahaanForm = {
  nama: "",
  email: "",
  alamat: "",
  kontak_1: "",
  kontak_2: "",
}

// 4. Build RPC schemas from reusable field schemas.
export const perusahaanCreateRpcParamsSchema = z.object({
  p_nama: nonEmpty3,
  p_email: optionalEmail,
  p_alamat: optionalText,
  p_kontak_1: optionalText,
  p_kontak_2: optionalText,
});
export type PerusahaanCreateParams = z.infer<typeof perusahaanCreateRpcParamsSchema>;

export const perusahaanCreateToRpcSchema = perusahaanFormSchema
  .transform((v) => ({
    p_nama: v.nama.trim(),
    p_email: v.email ?? null,
    p_alamat: v.alamat ?? null,
    p_kontak_1: v.kontak_1 ?? null,
    p_kontak_2: v.kontak_2 ?? null,
  }))
  .pipe(perusahaanCreateRpcParamsSchema);

export const perusahaanReturnResultSchema = z.object({
  id: z.string().uuid(),
  nama_asuransi: z.string(),
});
export const perusahaanCreateResultArraySchema = z.array(perusahaanReturnResultSchema).min(1);
export type PerusahaanReturnResult = z.infer<typeof perusahaanReturnResultSchema>;

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

/* ====================== UPDATE ====================== */
export const perusahaanUpdateFormSchema = z.object({
  id: z.string().uuid(),
  nama: nonEmpty3,
  email: optionalEmail,
  alamat: optionalText,
  kontak_1: nonEmptyKontak,
  kontak_2: optionalText,
});

export type PerusahaanUpdateFormValues = z.infer<typeof perusahaanUpdateFormSchema>;

