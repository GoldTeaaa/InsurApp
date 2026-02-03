import {z} from "zod";
import { perusahaanRowSchema } from "../types";

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
