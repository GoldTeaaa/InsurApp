import { z } from "zod";

export const polisTableQuerySchema = z.object({
  search: z.string().trim().max(100).optional().nullable(),
  page: z.number().int().optional().default(1),
  size: z.number().int().default(10),
});

export type PolisTableRow = {
  id: string;
  jenis_coas: string;
  nomor_polis: string;
  bisnis: string;
  nama_nasabah: string | null;
  total_premi: number | null;
  periode_mulai: string;
  periode_akhir: string;
  nama_perusahaan_asuransi: string | null;
  full_count: number;
};

export type PolisTableQuery = z.infer<typeof polisTableQuerySchema>;
