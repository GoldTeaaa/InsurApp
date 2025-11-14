import z from "zod";
import { JENIS_BISNIS } from "@/lib/types";

export const LaporanPelunasanKomisiRowSchema = z.object({
    nomor_polis: z.string(),
    nama_tertanggung: z.string(),
    bisnis: JENIS_BISNIS,
    periode_mulai: z.string(),
    periode_akhir: z.string(),
    no_kwitansi: z.string(),
    komisi_gross: z.number(),
    pph_komisi: z.number(),
    komisi_net: z.number(),
    nama_perusahaan_asuransi: z.string(),
    jenis_coas: z.string().nullable(),
    share: z.number(),
    amount_paid: z.number(),
    // amount_due: z.number(),
    status: z.string()
});

export const LaporanPelunasanKomisiSchema = z.array(LaporanPelunasanKomisiRowSchema);

export const LaporanPelunasanKomisiRPCSchema = z.object({
    rows: LaporanPelunasanKomisiSchema,
    total_count: z.number()
});

export type LaporanPelunasanKomisiRow = z.infer<typeof LaporanPelunasanKomisiRowSchema>;
export type LaporanPelunasanKomisiTable = z.infer<typeof LaporanPelunasanKomisiSchema>;
export type LaporanPelunasanKomisiRPCPayload = z.infer<typeof LaporanPelunasanKomisiRPCSchema>;