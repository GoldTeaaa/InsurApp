import { JENIS_COAS } from "@/lib/types";
import {z} from "zod";

export const PerusahaanCardDataSchema = z.object({
    id: z.string().uuid(),
    nama: z.string(),
    total_polis: z.number(),
    jumlah_polis_aktif: z.number(),
})

export const ListOfPerusahaanCardSchema = z.array(PerusahaanCardDataSchema);

export type PerusahaanCardType = z.infer<typeof PerusahaanCardDataSchema>;
export type PerusahaanCardListType = z.infer<typeof ListOfPerusahaanCardSchema>;

// Perusahaan Asuransi Details

export const PerusahaanStatCardDataSchema = PerusahaanCardDataSchema.extend({
    // TODO: add more stats
})

export type PerusahaanStatCardType = z.infer<typeof PerusahaanStatCardDataSchema>;


// CARD TABLE DATA

export const NasabahInPerusahaanTableCardSchema = z.object({
    id_perusahaan_asuransi: z.string().uuid(),
    nama_nasabah: z.string(),
    jenis_coas: JENIS_COAS,
    persentase_share: z.number(),
    total_premi: z.number(), //NET
    periode_akhir: z.coerce.date(),
});

export const ListOfNasabahInPerusahaanTableCardSchema = z.array(NasabahInPerusahaanTableCardSchema);

export type NasabahInPerusahaanTableCardType = z.infer<typeof NasabahInPerusahaanTableCardSchema>;
export type ListOfNasabahInPerusahaanTableCardType = z.infer<typeof ListOfNasabahInPerusahaanTableCardSchema>;