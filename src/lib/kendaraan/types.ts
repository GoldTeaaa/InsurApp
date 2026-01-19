import z from "zod";
import { JENIS_KENDARAAN } from "../types";

export const KendaraanSchema = z.object({
    kendaraan_id: z.string().uuid(),
    plat_nomor: z.string()
                .min(1, "Plat Nomor wajib diisi")
                .transform((v) => v.toUpperCase().replace(/\s/g, ""))
                .pipe(z.string().regex(/^[A-Z]{1,2}[1-9]{1}[0-9]{1,3}[A-Z]{1,3}$/, "Plat Nomor tidak valid")),
    jenis_kendaraan: JENIS_KENDARAAN,
    merk: z.string().optional().nullable(),
    model: z.string().optional().nullable(),
    tahun: z.coerce.number().optional(),
});

export const insertKendaraanSchema = KendaraanSchema.omit({ kendaraan_id: true });
export const kendaraanListElementSchema = KendaraanSchema.pick({ kendaraan_id: true, plat_nomor: true });
export const kendaraanListSchema = z.array(kendaraanListElementSchema); 

export type GetKendaraanType = z.infer<typeof KendaraanSchema>;
export type InsertKendaraanType = z.infer<typeof insertKendaraanSchema>;
export type KendaraanListType = z.infer<typeof kendaraanListSchema>;