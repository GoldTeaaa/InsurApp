import { JENIS_BISNIS, JENIS_COAS } from "@/lib/types";
import { z } from "zod";

export const defaultTableNasabahDetailSchema = z.object({
  nasabah_id: z.string(),
  polis_id: z.string(),
  nama: z.string(),
  nomor_polis: z.string(),
  jenis_coas: JENIS_COAS,
  bisnis: JENIS_BISNIS,
  periode_mulai: z.string(),
  periode_akhir: z.string(),
  total_premi: z.number(),
});

export const defaultTableNasabahDetailSchemaArray = z.array(defaultTableNasabahDetailSchema);

export const displayDefaultTableNasabahDetailSchema = defaultTableNasabahDetailSchema.omit({
  nasabah_id: true,
  polis_id: true,
});

export type DisplayDefaultTableSchema = z.infer<
  typeof displayDefaultTableNasabahDetailSchema
>;

export type DefaultTableNasabahDetailType = z.infer<typeof defaultTableNasabahDetailSchema>;

export type DefaultTableSchemaArrayType = z.infer<typeof defaultTableNasabahDetailSchemaArray>;
