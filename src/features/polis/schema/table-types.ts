import { z } from "zod";
import { JENIS_BISNIS, JENIS_COAS, JENIS_KENDARAAN, JenisKendaraan, SearchParamsSchema } from "@/lib/types";

export const polisTableRowSchema = z.object({
  id: z.string(),
  jenis_coas: z.string(),
  nomor_polis: z.string(),
  bisnis: z.string(),
  nama_nasabah: z.string().nullable(),
  total_premi: z.number().nullable(),
  periode_mulai: z.string(),
  periode_akhir: z.string(),
  list_perusahaan_asuransi: z.array(z.string()),
  plat_nomor: z.string().optional(), // Optional property from kendaraan
  jenis_kendaraan:  JENIS_KENDARAAN.optional(), // Optional property from kendaraan
})

// FOR PRODUCTION, USE DISCRIMINATED UNION FOR BISNIS TYPE AND MATCH IT WITH THE RPC RESPONSE
export type PolisRow = z.infer<typeof polisTableRowSchema>;

export const polisTableSchema = z.object({
  rows: z.array(polisTableRowSchema),
  total_count: z.number()
});

export type PolisTableType = z.infer<typeof polisTableSchema>;

export const polisSearchSchema = SearchParamsSchema.extend({
  plat_nomor: z.string().optional(),
  jenis_bisnis: JENIS_BISNIS.optional(),
  jenis_coas: JENIS_COAS.optional(),
}).omit({status: true});

export type PolisTableSearchParams = z.infer<typeof polisSearchSchema>