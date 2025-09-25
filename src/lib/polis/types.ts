import { z } from "zod";
import { no } from "zod/v4/locales";

const JENIS_BISNIS = z.enum(["kendaraan", "health", "life", "property", "marine"]);
const JENIS_COAS = z.enum(["coas", "non-coas"]);
const COAS_ROLE = z.enum(["leader", "member"]);

const uuid = z.string().uuid();
const noPolis = z.string().min(1, "Nomor polis wajib diisi");
const nonNegative = z.coerce.number().min(0);

export const baseSchema = z.object({
    nomor_polis: noPolis,
    bisnis: JENIS_BISNIS,
    total_premi: nonNegative,
    jenis_coas: JENIS_COAS,
    id_nasabah: uuid,
    periode_mulai: z.date({
        required_error: "Periode mulai wajib diisi.",
        invalid_type_error: "Format tanggal periode mulai tidak valid.",
    }),
    periode_akhir: z.coerce.date({
        required_error: "Periode akhir wajib diisi.",
        invalid_type_error: "Format tanggal periode akhir tidak valid.",
    }),
    detail_bisnis: z.record(z.any()).optional(),
})
.superRefine((data, context) => {
    if (data.periode_akhir <= data.periode_mulai) {
        context.addIssue({
            code: "custom",
            message: "Periode akhir harus setelah periode mulai",
            path: ["periode_akhir"],
        });
    }
});

export const PolisShareSchema = z.object({
  nomor_polis: noPolis,
  persentase_share: z.coerce.number().min(0).max(100),
  coas_role: COAS_ROLE,
  id_perusahaan_asuransi: uuid,
  polis_id: uuid,
});

export const DetailPremiSchema = z.object({
  premi_gross: nonNegative,
  discount: z.coerce.number().nonnegative(),
  biaya_admin_materai: z.coerce.number().nonnegative(),
  premi_net: nonNegative,
  jatuh_tempo: z.coerce.date(),
});

export const DetailKomisiSchema = z.object({
  komisi_gross: nonNegative,
  pph_komisi: nonNegative,
  komisi_net: nonNegative,
  jatuh_tempo: z.coerce.date(),
});

// const coasForm = 

// const nonCoasForm = 

export type Polis = z.infer<typeof baseSchema>;
export type PolisShare = z.infer<typeof PolisShareSchema>;
export type DetailPremi = z.infer<typeof DetailPremiSchema>;
export type DetailKomisi = z.infer<typeof DetailKomisiSchema>;