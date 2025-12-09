import { z } from "zod";
import { JENIS_BISNIS, JENIS_COAS } from "@/lib/types";

export const laporanProduksiSchema = z.object({
    polis_share_id: z.string().uuid(),
    periode_mulai: z.coerce.date(),
    periode_akhir: z.coerce.date(),
    nomor_polis: z.string(),
    nama_tertanggung: z.string(),
    jenis_bisnis: JENIS_BISNIS,
    premi: z.number(),
    discount: z.number(),
    biaya_admin_materai: z.number(),
    premi_net: z.number(),
    no_kwitansi_komisi: z.string().nullable().transform(val => val || ' - '),
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
export type LaporanProduksiTable = z.infer<typeof laporanProduksiRowSchema>;

// Schema for a single share within a policy
export const polisShareSchema = z.object({
    polis_share_id: z.string().uuid(),
    nama_perusahaan_asuransi: z.string(),
    share: z.number(),
    premi: z.object({
        bruto: z.number(),
        discount: z.number(),
        biaya_admin_materai: z.number(),
        net: z.number(),
    }),
    komisi: z.object({
        no_kwitansi: z.string(),
        bruto: z.number(),
        pph: z.number(),
        net: z.number(),
    }),
});

// Schema for the final grouped/nested data structure
export const groupedProduksiDataSchema = z.object({
    nomor_polis: z.string(),
    periode_mulai: z.date(),
    periode_akhir: z.date(),
    nama_tertanggung: z.string(),
    jenis_bisnis: JENIS_BISNIS,
    jenis_coas: JENIS_COAS,
    polis_shares: z.array(polisShareSchema),
});

export type PolisShare = z.infer<typeof polisShareSchema>;
export type GroupedProduksiData = z.infer<typeof groupedProduksiDataSchema>;
