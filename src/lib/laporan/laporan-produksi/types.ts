import { z } from "zod";
import { JENIS_BISNIS, JENIS_COAS } from "../../polis/create-types";

export const laporanProduksiSchema = z.object({
    periode_mulai: z.coerce.date(),
    periode_akhir: z.coerce.date(),
    nomor_polis: z.string(),
    nama_tertanggung: z.string(),
    jenis_bisnis: JENIS_BISNIS,
    // periode_polis: z.date(), GENERATED VIA THE REPORT
    premi: z.number(),
    discount: z.number(),
    biaya_admin_materai: z.number(),
    premi_net: z.number(),
    no_kwitansi_komisi: z.string(),
    komisi: z.number(),
    pph_komisi: z.number(),
    komisi_net: z.number(),
    nama_perusahaan_asuransi: z.string(),
    jenis_coas: JENIS_COAS,
    share: z.number(),
})

export const laporanProduksiRowSchema = z.array(laporanProduksiSchema);

export const laporanProduksiRPCSchema = z.object({
    rows: laporanProduksiRowSchema,
    total_count: z.number(),
})

export type RPCGetLaporanProduksi= z.infer<typeof laporanProduksiRPCSchema>;
export type LaporanProduksiRow = z.infer<typeof laporanProduksiSchema>;

