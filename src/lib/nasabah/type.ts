import { z } from "zod";

const nonEmpty = z.string().trim().min(1, "Wajib diisi");

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

const optionalEmail = z.string().email().optional();

export const TIPE = ["Pribadi", "Perusahaan"] as const;

export const AGAMA = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Khonghucu",
  "Lainnya",
] as const;

export const STATUS_PERKAWINAN = ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"] as const;

export const KEWARGANEGARAAN = ["WNI", "WNA"] as const;

export const GENDER = ["Pria", "Wanita"] as const;

// const emptyToNull = (value: unknown) =>
//   typeof value === "string" && value.trim() === "" ? null : value;

export const baseSchema = z.object({
  nama: nonEmpty,
  contact_1: nonEmpty,
  contact_2: optionalText,
  email: optionalEmail,
  alamat: optionalText,
});

export type BaseForm = z.infer<typeof baseSchema>;

export const perusahaanSchema = baseSchema.extend({
  tipe: z.literal("Perusahaan"),
  npwp_perusahaan: nonEmpty,
  nama_pic: nonEmpty,
  jabatan_pic: optionalText,
  email_pic: optionalEmail,
});

export const pribadiSchema = baseSchema.extend({
  tipe: z.literal("Pribadi"),
  nik: nonEmpty,
  tempat_lahir: nonEmpty,
  tanggal_lahir: z.string().trim().min(1, "Tanggal lahir wajib diisi"),
  jenis_kelamin: z.enum(GENDER).nullable(),
  alamat_ktp: optionalText,
  rt: optionalText,
  rw: optionalText,
  kelurahan_desa: optionalText,
  kecamatan: optionalText,
  kota_kabupaten: optionalText,
  provinsi: optionalText,
  kode_pos: optionalText,
  agama: z.enum(AGAMA).nullable().optional(),
  status_perkawinan: z
    .enum(STATUS_PERKAWINAN)
    .nullable()
    .optional(),
  pekerjaan: optionalText,
  kewarganegaraan: z.enum(KEWARGANEGARAAN).nullable().optional(),
});

export const formSchema = z.discriminatedUnion("tipe", [
  perusahaanSchema,
  pribadiSchema,
]);

export type NasabahForm = z.infer<typeof formSchema>;

export const defaultPribadiFormValues: NasabahForm = {
  tipe: "Pribadi",
  nama: "",
  contact_1: "",
  contact_2: "",
  email: "",
  alamat: "",

  nik: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: null,
  alamat_ktp: "",
  rt: "",
  rw: "",
  kelurahan_desa: "",
  kecamatan: "",
  kota_kabupaten: "",
  provinsi: "",
  kode_pos: "",
  agama: null,
  status_perkawinan: null,
  pekerjaan: "",
  kewarganegaraan: null,
};

export const defaultPerusahaanFormValues: NasabahForm = {
  tipe: "Perusahaan",
  nama: "",
  contact_1: "",
  contact_2: "",
  email: "",
  alamat: "",

  npwp_perusahaan: "",
  nama_pic: "",
  jabatan_pic: "",
  email_pic: "",
};
