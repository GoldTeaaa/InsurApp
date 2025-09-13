import { z } from "zod";

const nonEmpty = z.string().trim().min(1, "Wajib diisi");

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

const optionalEmail = z.string().email().optional();

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
  tipe: z.literal("perusahaan"),
  npwp_perusahaan: nonEmpty,
  nama_pic: nonEmpty,
  jabatan_pic: optionalText,
  email_pic: optionalEmail,
});

export const pribadiSchema = baseSchema.extend({
  tipe: z.literal("pribadi"),
  nik: nonEmpty,
  tempat_lahir: nonEmpty,
  tanggal_lahir: z.string().trim().min(1, "Tanggal lahir wajib diisi"),
  jenis_kelamin: z.enum(["Pria", "Wanita"], {
    message: "Jenis kelamin wajib diisi",
  }),
  alamat_ktp: optionalText,
  rt: optionalText,
  rw: optionalText,
  kelurahan_desa: optionalText,
  kecamatan: optionalText,
  kota_kabupaten: optionalText,
  provinsi: optionalText,
  kode_pos: optionalText,
  agama: z
    .enum([
      "Islam",
      "Kristen",
      "Katolik",
      "Hindu",
      "Budha",
      "Khonghucu",
      "Lainnya",
    ])
    .nullable()
    .optional(),
  status_perkawinan: z
    .enum(["Belum Kawin", "Kawin", "CeraiHidup", "CeraiMati"])
    .nullable()
    .optional(),
  pekerjaan: optionalText,
  kewarganegaraan: z.enum(["WNI", "WNA"]).nullable().optional(),
});

type pribadiFormSchema = z.infer<typeof pribadiSchema>;

export const formSchema = z.discriminatedUnion("tipe", [
  perusahaanSchema,
  pribadiSchema,
]);

export type NasabahForm = z.infer<typeof formSchema>;

export const defaultNasabahFormValues: NasabahForm = {
  tipe: "pribadi",
  nama: "",
  contact_1: "",
  contact_2: null,
  email: "",
  alamat: null,

  // pribadi-only branch
  nik: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: undefined as any, // user must pick "L" or "P"
  alamat_ktp: null,
  rt: null,
  rw: null,
  kelurahan_desa: null,
  kecamatan: null,
  kota_kabupaten: null,
  provinsi: null,
  kode_pos: null,
  agama: null,
  status_perkawinan: null,
  pekerjaan: null,
  kewarganegaraan: null,
};
