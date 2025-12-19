import z from "zod";
import { JENIS_KENDARAAN } from "../types";

export const getKendaraanSchema = z.object({
    kendaraan_id: z.string().uuid(),
    plat_nomor: z.string().min(1, "Plat Nomor wajib diisi"),
    jenis_kendaraan: JENIS_KENDARAAN,
    merk: z.string().optional().nullable(),
    model: z.string().optional().nullable(),
    tahun: z.coerce.number().optional(),
});

export const insertKendaraanSchema = getKendaraanSchema.omit({ kendaraan_id: true });
export const kendaraanListElementSchema = getKendaraanSchema.pick({ kendaraan_id: true, plat_nomor: true });
export const kendaraanListSchema = z.array(kendaraanListElementSchema); 

export type GetKendaraanType = z.infer<typeof getKendaraanSchema>;
export type InsertKendaraanType = z.infer<typeof insertKendaraanSchema>;
export type KendaraanListType = z.infer<typeof kendaraanListSchema>;