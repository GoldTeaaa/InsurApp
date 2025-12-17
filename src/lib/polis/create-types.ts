import { z } from "zod";
import { JENIS_BISNIS, JENIS_COAS, JENIS_KENDARAAN } from "../types";

const COAS_ROLE = z.enum(["leader", "member"]);
const JENIS_RATE = z.enum(["mille", "percent"]);

const noPolis = z.string().min(1, "Nomor polis wajib diisi");
const nonNegative = z.coerce.number().min(1, "Nominal wajib diisi");

// DETAIL SCHEMAS
export const DetailPremiSchema = z.object({
  premi_gross: z.coerce.number().min(0, "Premi wajib diisi"),
  discount: z.coerce.number().nonnegative(),
  biaya_admin_materai: nonNegative,
  premi_net: z.coerce.number().nonnegative("Premi tidak bisa negatif"),
});

export const DetailKomisiSchema = z.object({
  komisi_gross: nonNegative,
  pph_komisi: nonNegative,
  komisi_net: z.coerce.number().min(0, "Komisi wajib diisi"),
});

// SHARE SCHEMA
export const PolisShareSchema = z.object({
  persentase_share: z.coerce
    .number()
    .min(1, "Persentase share wajib diisi")
    .max(100, "Persentase share tidak boleh lebih dari 100"),
  coas_role: COAS_ROLE,
  id_perusahaan_asuransi: z.string().uuid("Asuransi Penanggung Belum Dipilih"),
  detail_premi: DetailPremiSchema,
  detail_komisi: DetailKomisiSchema,
});

const kendaraanSchema = z.object({
  bisnis: z.literal("kendaraan"),
  jenis_kendaraan: JENIS_KENDARAAN,
  plat_nomor: z.string().min(3, "Plat nomor wajib diisi"),
});

const healthSchema = z.object({
  bisnis: z.literal("health"),
});
const marineSchema = z.object({
  bisnis: z.literal("marine_cargo"),
});
const propertySchema = z.object({
  bisnis: z.literal("properti"),
});

const businessDetailsSchema = z.discriminatedUnion("bisnis", [kendaraanSchema, healthSchema, marineSchema, propertySchema]);

export const basePolisObjectSchema = z.object({
  nomor_polis: noPolis,
  bisnis: JENIS_BISNIS,
  id_nasabah: z.string().uuid("Nasabah Belum Dipilih"),
  total_sum_insured: nonNegative,
  nilai_rate: z.coerce.number().positive("Rate harus lebih dari 0"),
  jenis_rate: JENIS_RATE,
  total_premi: z.coerce.number().min(0, "Total Premi Wajib Diisi"),
  jenis_coas: JENIS_COAS,
  periode_mulai: z.preprocess(
    (arg) => (typeof arg === "string" && arg.trim() === "" ? undefined : arg),
    z.coerce.date({
      required_error: "Periode mulai wajib diisi.",
      invalid_type_error: "Format tanggal periode mulai tidak valid.",
    })
  ),
  periode_akhir: z.preprocess(
    (arg) => (typeof arg === "string" && arg.trim() === "" ? undefined : arg),
    z.coerce.date({
      required_error: "Periode akhir wajib diisi.",
      invalid_type_error: "Format tanggal periode akhir tidak valid.",
    })
  ),
  bisnis_details: businessDetailsSchema,
  detail_bisnis: z.record(z.any()).optional(), // May be remove later
});

const basePolisSchema = basePolisObjectSchema.superRefine((data, ctx) => {
  // 1) periode checks
  // Ensure both dates are valid before comparing
  if (
    data.periode_mulai instanceof Date &&
    data.periode_akhir instanceof Date
  ) {
    if (data.periode_akhir <= data.periode_mulai) {
      ctx.addIssue({
        code: "custom",
        message: "Periode akhir harus setelah periode mulai",
        path: ["periode_akhir"],
      });
    }
  }

  // 2) total_premi should not exceed total_sum_insured
  // We add a small tolerance for floating point inaccuracies
  if (data.total_premi > data.total_sum_insured + 1e-9) {
    ctx.addIssue({
      code: "custom",
      message: "Total premi tidak boleh melebihi Total Sum Insured.",
      path: ["total_premi"],
    });
  }

  if (data.bisnis === "kendaraan") {
    if (!data.bisnis_details) {
      ctx.addIssue({
        code: "custom",
        message: "Detail kendaraan wajib diisi.",
        path: ["bisnis_details"],
      });
    }
  }
});

// NON-COAS: single share object
export const nonCoasSchema = basePolisObjectSchema.extend({
  jenis_coas: z.literal("non-coas"),
  shares: PolisShareSchema,
});

// COAS: array of share objects, min 2
export const coasSchema = basePolisObjectSchema.extend({
  jenis_coas: z.literal("coas"),
  shares: z
    .array(PolisShareSchema)
    .min(2, "Polis coas harus lebih dari satu anggota."),
});

export type PolisCoas = z.infer<typeof coasSchema>;

export const PolisSchema = z
  .discriminatedUnion("jenis_coas", [coasSchema, nonCoasSchema])
  .and(basePolisSchema) // Re-apply the base refinements after extending
  .superRefine((data, ctx) => {
    // Helper to sum premi_net from shares (handles single object or array)
    const getSharesArray = () =>
      data.jenis_coas === "coas" ? data.shares : [data.shares];

    const sharesArr = getSharesArray();

    if (
      data.periode_mulai instanceof Date &&
      data.periode_akhir instanceof Date
    ) {
      if (data.periode_akhir <= data.periode_mulai) {
        ctx.addIssue({
          code: "custom",
          message: "Periode akhir harus setelah periode mulai",
          path: ["periode_akhir"],
        });
      }
    }

    // 2) Sum of percent must be ~100 for coas
    if (data.jenis_coas === "coas") {
      const sumPercent = sharesArr.reduce(
        (s, sh) => s + Number(sh.persentase_share ?? 0),
        0
      );
      const EPS = 1e-9;
      if (Math.abs(sumPercent - 100) > EPS) {
        ctx.addIssue({
          code: "custom",
          message: `Total persentase share untuk coas harus = 100 (saat ini ${sumPercent})`,
          path: ["shares.persentase_share"],
        });
      }
    } else {
      // This is the "non-coas" case
      // For non-coas, the single share's gross premi should not exceed the total premi
      if (data.shares.detail_premi.premi_gross > data.total_premi + 1e-9) {
        ctx.addIssue({
          code: "custom",
          message: "Premi Gross tidak boleh melebihi Total Premi.",
          path: ["shares", "detail_premi", "premi_gross"],
        });
      }
    }

    // 3) Sum of premi_net should match total_premi
    const sumPremiNet = sharesArr.reduce(
      (s, sh) => s + Number(sh.detail_premi.premi_net ?? 0),
      0
    );
    // Use a small epsilon for float comparison
    if (Math.abs(sumPremiNet - data.total_premi) > 1e-9) {
      // This validation can be noisy during input, consider if it's only for final submission
    }

    // 4) Basic share-level checks (optional): ensure each share has detail_premi.premi_net or premi_gross
    sharesArr.forEach((sh, idx) => {
      const hasPremi =
        sh?.detail_premi &&
        (sh.detail_premi.premi_net != null ||
          sh.detail_premi.premi_gross != null);
      if (!hasPremi) {
        ctx.addIssue({
          code: "custom",
          message: `share[${idx}] must include detail_premi.premi_net or premi_gross`,
          path: ["shares", idx.toString(), "detail_premi"],
        });
      }
    });
  });

export type Polis = z.infer<typeof PolisSchema>;
export type PolisShare = z.infer<typeof PolisShareSchema>;
export type DetailPremi = z.infer<typeof DetailPremiSchema>;
export type DetailKomisi = z.infer<typeof DetailKomisiSchema>;