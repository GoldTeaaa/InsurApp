import { z, ZodError } from "zod";
import { optional } from "zod/v4-mini";

export type FlattenedIssues = ReturnType<ZodError<any>["flatten"]>;

export type initialState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

// ================================== INSERT & UPDATE SCHEMA =====================================
/* ===== Enums (mirror DB enums) ===== */
// enums.ts — single source of truth for values used by UI, DB, and Zod
export const TIPE = ["pribadi", "perusahaan"] as const;
export const JK = ["L", "P"] as const;
export const AGAMA = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Budha",
  "Khonghucu",
  "Lainnya",
] as const;
// pick one canonical spelling and stick to it everywhere:
export const STATUS = [
  "Belum Kawin",
  "Kawin",
  "CeraiHidup",
  "CeraiMati",
] as const;
export const KEWARGANEGARAAN = ["WNI", "WNA"] as const;

export const tipeSchema = z.enum(TIPE);

export const jenisKelaminSchema = z.preprocess(
  emptyToNull,
  z.enum(JK).nullable()
);

export const agamaSchema = z.preprocess(
  emptyToNull,
  z.enum(AGAMA).nullable().optional()
);

export const statusPerkawinanSchema = z.preprocess(
  emptyToNull,
  z.enum(STATUS).nullable()
);

export const kewarganegaraanSchema = z.preprocess(
  emptyToNull,
  z.enum(KEWARGANEGARAAN).nullable()
);

/* ===== String helpers (keep ZodString; avoid ZodEffects for .min) ===== */
const nonEmpty = z.string().trim().min(1, "Wajib diisi");

const optionalText = z.string().trim().transform(v => v === "" ? null : v).nullable().optional();

const optionalEmail = z.string().trim().toLowerCase()
  .transform(v => v === "" ? null : v)
  .pipe(z.string().email("Format email tidak valid").nullable())
  .optional();

/* ===== Base (RPC: p_contact_1/2, p_email, p_alamat) ===== */
export const baseSchema = z.object({
  nama: nonEmpty,
  contact_1: nonEmpty,
  contact_2: optionalText,
  email: optionalEmail,
  alamat: optionalText,
});

/* ===== PRIBADI (RPC: public.pribadi_input) ===== */
export const pribadiSchema = z.object({
  nik: nonEmpty,
  nama_tertanggung: nonEmpty,
  tempat_lahir: nonEmpty,
  tanggal_lahir: z.string().trim().min(1, "Tanggal lahir wajib diisi"),
  jenis_kelamin: jenisKelaminSchema,
  alamat_ktp: optionalText,
  rt: optionalText,
  rw: optionalText,
  kelurahan_desa: optionalText,
  kecamatan: optionalText,
  kota_kabupaten: optionalText,
  provinsi: optionalText,
  kode_pos: optionalText,
  agama: agamaSchema.nullable(),
  status_perkawinan: statusPerkawinanSchema.nullable(),
  pekerjaan: optionalText,
  kewarganegaraan: kewarganegaraanSchema.nullable(),
});

/* ===== PERUSAHAAN (RPC: public.perusahaan_input) ===== */
export const perusahaanSchema = z.object({
  nama_perusahaan: optionalText,
  npwp_perusahaan: nonEmpty,
  nama_pic: nonEmpty,
  jabatan_pic: optionalText,
  email_pic: optionalEmail,
});

/* ===== Discriminated union ===== */
const formPribadi = baseSchema.extend({
  tipe: z.literal("pribadi"),
  pribadi: pribadiSchema,
  perusahaan: z.never().optional(),
});

const formPerusahaan = baseSchema.extend({
  tipe: z.literal("perusahaan"),
  perusahaan: perusahaanSchema,
  pribadi: z.never().optional(),
});

export const nasabahInputFormSchema = z.discriminatedUnion("tipe", [
  formPribadi,
  formPerusahaan,
]);

// export type NasabahPribadiUpdate = z.
export type NasabahFormData = z.infer<typeof nasabahInputFormSchema>;
export type NasabahFormUIData = z.input<typeof nasabahInputFormSchema>;
export type NasabahFormServerData = z.output<typeof nasabahInputFormSchema>;

// ================================ DASHBOARD VIEW ================================

export type NasabahSort =
  | "created_desc"
  | "created_asc"
  | "name_asc"
  | "name_desc";

export type NasabahRow = {
  id: string;
  tipe: "pribadi" | "perusahaan";
  nama: string | null;
  contact_1: string | null;
  contact_2: string | null;
  email: string | null;
  alamat: string | null;
  created_at: string;
  updated_at: string | null;
};
