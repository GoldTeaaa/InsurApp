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