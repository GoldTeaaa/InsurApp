import { z, ZodError } from 'zod';

type FlattenedIssues = ReturnType<ZodError<any>['flatten']>;

const tipeSchema = z.enum(['pribadi', 'perusahaan']);

export const pribadiSchema = z.object({
  nama_lengkap: z.string().min(1, 'Wajib diisi'),
  no_ktp: z.string().min(1, 'Wajib diisi'),
  tanggal_lahir: z.string().optional().nullable(),
});

export const perusahaanSchema = z.object({
  nama_perusahaan: z.string().min(1, 'Wajib diisi'),
  pic_nama: z.string().min(1, 'Wajib diisi'),
  no_ktp_pic: z.string().optional().nullable(),
});

export const baseSchema = z.object({
  nomor_telfon: z.string().min(1, 'Wajib diisi'),
  email: z.string().email('Format email tidak valid').optional().nullable(),
  alamat: z.string().max(300, 'Maks 300').optional().nullable(),
});

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

export const nasabahInputFormSchema = z.discriminatedUnion('tipe', [formPribadi, formPerusahaan]);

export type NasabahFormData = z.infer<typeof nasabahInputFormSchema>;