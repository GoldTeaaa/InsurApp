import { z } from "zod";

const nonEmpty = z.string().trim().min(1, "Wajib diisi");

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

const optionalEmail = z.string().email().optional();

export const TIPE = ["pribadi", "perusahaan"] as const;

export const AGAMA = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Khonghucu",
  "Lainnya",
] as const;

export const STATUS_PERKAWINAN = [
  "Belum Menikah",
  "Menikah",
  "Cerai Hidup",
  "Cerai Mati",
] as const;

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
  status_perkawinan: z.enum(STATUS_PERKAWINAN).nullable().optional(),
  pekerjaan: optionalText,
  kewarganegaraan: z.enum(KEWARGANEGARAAN).nullable().optional(),
});

export const formSchema = z.discriminatedUnion("tipe", [
  perusahaanSchema,
  pribadiSchema,
]);

export type NasabahForm = z.infer<typeof formSchema>;

export const defaultPribadiFormValues: NasabahForm = {
  tipe: "pribadi",
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
  tipe: "perusahaan",
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

// payload shape to Rpc function
export const toRpcCreatePribadi = z
  .object({
    tipe: z.literal("pribadi"),
    nama: nonEmpty,
    contact_1: nonEmpty,
    contact_2: optionalText,
    email: optionalEmail,
    alamat: optionalText,

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
    status_perkawinan: z.enum(STATUS_PERKAWINAN).nullable().optional(),
    pekerjaan: optionalText,
    kewarganegaraan: z.enum(KEWARGANEGARAAN).nullable().optional(),
  })
  .transform((v) => ({
    // the rpc function directly fill the tipe so no need to include in in the payload
    nama: v.nama,
    contact_1: v.contact_1,
    contact_2: v.contact_2,
    email: v.email,
    alamat: v.alamat,
    pribadi: {
      nik: v.nik,
      tempat_lahir: v.tempat_lahir,
      tanggal_lahir: v.tanggal_lahir,
      jenis_kelamin: v.jenis_kelamin,
      alamat_ktp: v.alamat_ktp,
      rt: v.rt,
      rw: v.rw,
      kelurahan_desa: v.kelurahan_desa,
      kecamatan: v.kecamatan,
      kota_kabupaten: v.kota_kabupaten,
      provinsi: v.provinsi,
      kode_pos: v.kode_pos,
      agama: v.agama,
      status_perkawinan: v.status_perkawinan,
      pekerjaan: v.pekerjaan,
      kewarganegaraan: v.kewarganegaraan,
    },
  }));

export const toRpcCreatePerusahaan = z
  .object({
    tipe: z.literal("perusahaan"),
    nama: nonEmpty,
    contact_1: nonEmpty,
    contact_2: optionalText,
    email: optionalEmail,
    alamat: optionalText,

    npwp_perusahaan: nonEmpty,
    nama_pic: nonEmpty,
    jabatan_pic: optionalText,
    email_pic: optionalEmail,
  })
  .transform((v) => ({
    // the rpc function directly fill the tipe so no need to include in in the payload
    nama: v.nama,
    contact_1: v.contact_1,
    contact_2: v.contact_2,
    email: v.email,
    alamat: v.alamat,
    perusahaan: {
      npwp_perusahaan: v.npwp_perusahaan,
      nama_pic: v.nama_pic,
      jabatan_pic: v.jabatan_pic,
      email_pic: v.email_pic,
    },
  }));

