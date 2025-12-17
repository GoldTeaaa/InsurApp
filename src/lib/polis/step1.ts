import { z } from "zod";
import {
  AGAMA,
  GENDER,
  KEWARGANEGARAAN,
  STATUS_PERKAWINAN,
} from "@/lib/nasabah/type";

export const ListNasabah = z.object({
    id: z.string().uuid(),
    nama: z.string()
}).transform(v =>{ // NEED TO TRANSFORM BECAUSE THE SELECT COMPONENTS HAVE A GENERIC KEY VALUE NAMED "value"
  return {
    id: v.id,
    value: v.nama
  }
})

  // ======================== GET NASABAH LIST (Used in Polis Form) ========================
const baseDetailsSchema = z.object({
  nama: z.string(),
  tipe: z.union([z.literal("pribadi"), z.literal("perusahaan")]),
  email: z.string().email().nullable(),
  alamat: z.string().nullable(),
  contact_1: z.string(),
  contact_2: z.string().nullable()
});

const pribadiDetailsObject = z.object({
  nik: z.string(),
  nama_tertanggung: z.string(),
  tempat_lahir: z.string(),
  tanggal_lahir: z.string(), // or z.date() if you parse it
  jenis_kelamin: z.enum(GENDER).nullable(),
  alamat_ktp: z.string().nullable(),
  rt: z.string().nullable(),
  rw: z.string().nullable(),
  kelurahan_desa: z.string().nullable(),
  kecamatan: z.string().nullable(),
  kota_kabupaten: z.string().nullable(),
  provinsi: z.string().nullable(),
  kode_pos: z.string().nullable(),
  agama: z.enum(AGAMA).nullable(),
  status_perkawinan: z.enum(STATUS_PERKAWINAN).nullable(),
  pekerjaan: z.string().nullable(),
  kewarganegaraan: z.enum(KEWARGANEGARAAN).nullable(),
});

const perusahaanDetailsObject = z.object({
  nama_perusahaan: z.string(),
  npwp_perusahaan: z.string(),
  nama_pic: z.string(),
  jabatan_pic: z.string().nullable(),
  email_pic: z.string().email().nullable(),
});

export const nasabahDetailsSchema = baseDetailsSchema.extend({
    pribadi: pribadiDetailsObject.optional(),
    perusahaan: perusahaanDetailsObject.optional(),
}).superRefine((data, ctx) => {
    if (data.tipe === 'pribadi' && !data.pribadi) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "pribadi object is required when tipe is 'pribadi'" });
    }
    if (data.tipe === 'perusahaan' && !data.perusahaan) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "perusahaan object is required when tipe is 'perusahaan'" });
    }
});

export type NasabahDetailsType = z.infer<typeof nasabahDetailsSchema>;
export type ListNasabahType = z.infer<typeof ListNasabah>;
