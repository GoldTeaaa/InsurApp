import { AGING_RANGE } from "@/lib/types";
import { z } from "zod";

export type searchParamsProps = {
    search: string;
    page: string;
    size: string;
    date_from: string;
    date_to: string;
};

const LaporanAgingPremiRowSchema = z.object({
    nomor_polis: z.string(),
    nama_tertanggung: z.string(),
    jenis_bisnis: z.string(),
    periode_mulai: z.coerce.date(),
    periode_akhir: z.coerce.date(),
    premi_gross: z.number(),
    discount: z.number(),
    biaya_admin_materai: z.number(),
    premi_net: z.number(),
    nama_perusahaan_asuransi: z.string(),
    jenis_coas: z.string(),
    share: z.number(),
    aging_bracket: z.enum(AGING_RANGE),
    // Optional
    detail_premi_status: z.enum(["partially_paid", "unpaid"]).optional(),
    amount_due: z.number().optional(),
    amount_paid: z.number().optional(),
})

export const LaporanAgingPremiTableSchema = z.array(LaporanAgingPremiRowSchema);

export const LaporanAgingPremiRPCSchema = z.object({
    rows: LaporanAgingPremiTableSchema,
    total_count: z.number(),
})

export type LaporanAgingPremiRow = z.infer<typeof LaporanAgingPremiRowSchema>;
export type LaporanAgingPremiTable = z.infer<typeof LaporanAgingPremiTableSchema>;
export type LaporanAgingPremiRPC = z.infer<typeof LaporanAgingPremiRPCSchema>;