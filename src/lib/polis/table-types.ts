import { z } from "zod";
import { JENIS_BISNIS, JenisKendaraan, SearchParamsSchema } from "@/lib/types";

export type BasePolisTable = { // This now represents a complete row
	id: string
	nomor_polis: string
	bisnis: string
	nama_nasabah: string | null
	total_premi: number | null
	periode_mulai: string
	periode_akhir: string
	nama_perusahaan_asuransi: string | null
	plat_nomor?: string // Optional property from kendaraan
	jenis_kendaraan?: JenisKendaraan // Optional property from kendaraan
}

export type PolisRow = {
  id: string;
  jenis_coas: string;
  nomor_polis: string;
  bisnis: string;
  nama_nasabah: string | null;
  total_premi: number | null;
  periode_mulai: string;
  periode_akhir: string;
  nama_perusahaan_asuransi: string | null;
  plat_nomor?: string // Optional property from kendaraan
	jenis_kendaraan?: JenisKendaraan // Optional property from kendaraan
}

export type PolisTableRow = {
  rows: PolisRow[];
  total_count: number;
};

export const polisSearchSchema = SearchParamsSchema.extend({
  plat_nomor: z.string().optional(),
  jenis_bisnis: JENIS_BISNIS.optional(),
})

export type PolisTableSearchParams = z.infer<typeof polisSearchSchema>