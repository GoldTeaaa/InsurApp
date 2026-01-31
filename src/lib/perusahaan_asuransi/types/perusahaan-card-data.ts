import {z} from "zod";

export const PerusahaanCardDataSchema = z.object({
    id: z.string().uuid(),
    nama: z.string(),
    total_polis: z.number(),
    jumlah_polis_aktif: z.number(),
})

export type PerusahaanCardType = z.infer<typeof PerusahaanCardDataSchema>;