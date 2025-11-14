import { 
    JENIS_BISNIS,
    JENIS_COAS,
    STATUS_BAYAR
} from "@/lib/types";
import { z } from "zod";

export const pelunasanPremiRowSchema = z.object({
    nomor_polis: z.string(),
    nama_tertanggung: z.string(),
    bisnis: JENIS_BISNIS,
    periode_mulai: z.coerce.date(),
    periode_akhir: z.coerce.date(),
    premi_gross: z.number(),
    discount: z.number(),
    biaya_admin_materai: z.number(),
    premi_net: z.number(),
    nama_perusahaan_asuransi: z.string(),
    jenis_coas: JENIS_COAS,
    share: z.number(),
    status: STATUS_BAYAR,
    amount_paid: z.number(),
    tanggal_bayar: z.coerce.date(),
    // amount_due: z.number(),
});

export const PelunasanPremiTableSchema = z.array(pelunasanPremiRowSchema);

export const PelunasanPremiRPCSchema = z.object({
    rows: PelunasanPremiTableSchema,
    total_count: z.number(),
})

export type PelunasanPremiRow = z.infer<typeof pelunasanPremiRowSchema>;
export type PelunasanPremiTable = z.infer<typeof PelunasanPremiTableSchema>;
export type PelunasanPremiRPC = z.infer<typeof PelunasanPremiRPCSchema>;