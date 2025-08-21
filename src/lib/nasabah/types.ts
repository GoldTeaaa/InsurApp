import { z, ZodError } from 'zod';

export type FlattenedIssues = ReturnType<ZodError<any>['flatten']>;

export type initialState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// ================================== INSERT & UPDATE SCHEMA =====================================
/* ===== Enums (mirror DB enums) ===== */
export const tipeSchema = z.enum(['pribadi', 'perusahaan']);
export const jenisKelaminSchema = z.enum(['L', 'P']).nullable();
export const agamaSchema = z
  .enum(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Khonghucu', 'Lainnya'])
  .nullable()
  .optional();
export const statusPerkawinanSchema = z
  .enum(['BelumKawin', 'Kawin', 'CeraiHidup', 'CeraiMati']).nullable();
export const kewarganegaraanSchema = z.enum(['WNI', 'WNA']).nullable();

/* ===== String helpers (keep ZodString; avoid ZodEffects for .min) ===== */
const nonEmpty = z.string().trim().min(1, 'Wajib diisi');

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === '' ? null : v))
  .optional()
  .nullable();

const optionalEmail = z.preprocess(
  (v) => {
    if (typeof v !== 'string') return v;
    const s = v.trim();
    // Treat empty string as "no value"
    return s === '' ? null : s.toLowerCase();
  },
  z.string().email('Format email tidak valid').nullable().optional()
);


/* ===== Base (RPC: p_contact_1/2, p_email, p_alamat) ===== */
export const baseSchema = z.object({
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
  // Must be a non-empty string in 'YYYY-MM-DD' format from the date input.
  tanggal_lahir: z.string().trim().min(1, 'Tanggal lahir wajib diisi'),
  jenis_kelamin: jenisKelaminSchema,
  alamat_ktp: optionalText,
  rt: optionalText,
  rw: optionalText,
  kelurahan_desa: optionalText,
  kecamatan: optionalText,
  kota_kabupaten: optionalText,
  provinsi: optionalText,
  kode_pos: optionalText,
  agama: agamaSchema,
  status_perkawinan: statusPerkawinanSchema,
  pekerjaan: optionalText,
  kewarganegaraan: kewarganegaraanSchema,
});

/* ===== PERUSAHAAN (RPC: public.perusahaan_input) ===== */
export const perusahaanSchema = z.object({
  nama_perusahaan: nonEmpty,
  npwp_perusahaan: nonEmpty,
  nama_pic: nonEmpty,
  jabatan_pic: optionalText,
  email_pic: optionalEmail,
});

/* ===== Discriminated union ===== */
const formPribadi = baseSchema.extend({
  tipe: z.literal('pribadi'),
  pribadi: pribadiSchema,
  perusahaan: z.never().optional(),
});

const formPerusahaan = baseSchema.extend({
  tipe: z.literal('perusahaan'),
  perusahaan: perusahaanSchema,
  pribadi: z.never().optional(),
});

export const nasabahInputFormSchema = z.discriminatedUnion('tipe', [
  formPribadi,
  formPerusahaan,
]);

export type NasabahFormData = z.infer<typeof nasabahInputFormSchema>;
export type NasabahFormUIData = z.input<typeof nasabahInputFormSchema>;

// ================================ DASHBOARD VIEW ================================

export type NasabahSort = 'created_desc' | 'created_asc' | 'name_asc' | 'name_desc';

export type NasabahRow = {
  id: string;
  tipe: 'pribadi' | 'perusahaan';
  nama: string | null;
  contact_1: string | null;
  contact_2: string | null;
  email: string | null;
  alamat: string | null;
  created_at: string;
  updated_at: string | null;
};

