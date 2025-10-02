import { z } from "zod";

const JENIS_BISNIS = z.enum(["kendaraan", "health", "life", "property", "marine"]);
export const JENIS_COAS = z.enum(["coas", "non-coas"]);
const COAS_ROLE = z.enum(["leader", "member"]);

const uuid = z.string().uuid();
const noPolis = z.string().min(1, "Nomor polis wajib diisi");
const nonNegative = z.coerce.number().min(0);

// DETAIL SCHEMAS
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

// SHARE SCHEMA
export const PolisShareSchema = z.object({
  nomor_polis: noPolis,
  persentase_share: z.coerce.number().min(0).max(100),
  coas_role: COAS_ROLE,
  id_perusahaan_asuransi: uuid,
  detail_premi: DetailPremiSchema,
  detail_komisi: DetailKomisiSchema,
});

// BASE POLIS
const basePolisSchema = z.object({
  nomor_polis: noPolis,
  bisnis: JENIS_BISNIS,
  id_nasabah: uuid,
  total_premi: nonNegative,
  jenis_coas: JENIS_COAS,
  periode_mulai: z.coerce.date({
    required_error: "Periode mulai wajib diisi.",
    invalid_type_error: "Format tanggal periode mulai tidak valid.",
  }),
  periode_akhir: z.coerce.date({
    required_error: "Periode akhir wajib diisi.",
    invalid_type_error: "Format tanggal periode akhir tidak valid.",
  }),
  detail_bisnis: z.record(z.any()).optional(),
});

// NON-COAS: single share object
const nonCoasSchema = basePolisSchema.extend({
  jenis_coas: z.literal("non-coas"),
  shares: PolisShareSchema,
});

// COAS: array of share objects, min 2
const coasSchema = basePolisSchema.extend({
  jenis_coas: z.literal("coas"),
  shares: z
    .array(PolisShareSchema)
    .min(2, "Polis coas harus lebih dari satu anggota."),
});

export type PolisCoas = z.infer<typeof coasSchema>;

export const PolisSchema = z
  .discriminatedUnion("jenis_coas", [coasSchema, nonCoasSchema])
  .superRefine((data, ctx) => {
    // 1) periode checks
    if (data.periode_akhir <= data.periode_mulai) {
      ctx.addIssue({
        code: "custom",
        message: "Periode akhir harus setelah periode mulai",
        path: ["periode_akhir"],
      });
    }

    // Helper to sum premi_net from shares (handles single object or array)
    const getSharesArray = () =>
      data.jenis_coas === "coas" ? (data.shares) : [data.shares];

    const sharesArr = getSharesArray();

    // 2) Sum of percent must be ~100 for coas
    if (data.jenis_coas === "coas") {
      const sumPercent = sharesArr.reduce((s, sh) => s + Number(sh.persentase_share ?? 0), 0);
      const EPS = 1e-9;
      if (Math.abs(sumPercent - 100) > EPS) {
        ctx.addIssue({
          code: "custom",
          message: `Total persentase share untuk coas harus = 100 (saat ini ${sumPercent})`,
          path: ["shares"],
        });
      }
    }

    // 3) Sum of premi_net (or premi_gross fallback) should match total_premi (client-side check)
    const sumPremi = sharesArr.reduce((s, sh) => {
      const net = sh?.detail_premi?.premi_net;
      const gross = sh?.detail_premi?.premi_gross;
      const val = net ?? gross ?? 0;
      return s + Number(val);
    }, 0);

    // Use numeric epsilon because inputs may be floats
    const EPS_PREMI = 1e-6;
    if (Math.abs(sumPremi - Number(data.total_premi ?? 0)) > EPS_PREMI) {
      ctx.addIssue({
        code: "custom",
        message: `total_premi tidak cocok dengan jumlah premi shareholders (expected ${sumPremi})`,
        path: ["total_premi"],
      });
    }

    // 4) Basic share-level checks (optional): ensure each share has detail_premi.premi_net or premi_gross
    sharesArr.forEach((sh, idx) => {
      const hasPremi =
        sh?.detail_premi && (sh.detail_premi.premi_net != null || sh.detail_premi.premi_gross != null);
      if (!hasPremi) {
        ctx.addIssue({
          code: "custom",
          message: `share[${idx}] must include detail_premi.premi_net or premi_gross`,
          path: ["shares", idx.toString(), "detail_premi"],
        });
      }
    });
  });

type BasePolis = z.infer<typeof basePolisSchema>;
export type Polis = z.infer<typeof PolisSchema>;
export type PolisShare = z.infer<typeof PolisShareSchema>;
export type DetailPremi = z.infer<typeof DetailPremiSchema>;
export type DetailKomisi = z.infer<typeof DetailKomisiSchema>;

const baseDefault = {
  nomor_polis: "",
  bisnis: undefined,
  id_nasabah: "",
  total_premi: undefined,
  periode_mulai: new Date(),
  periode_akhir: new Date(),
  detail_bisnis: {},
};

const emptyDetailPremi = {
  premi_gross: 0,
  discount: 0,
  biaya_admin_materai: 0,
  premi_net: 0,
  jatuh_tempo: new Date(),
};

const emptyDetailKomisi = {
  komisi_gross: 0,
  pph_komisi: 0,
  komisi_net: 0,
  jatuh_tempo: new Date(),
};

const emptyShare = {
  nomor_polis: "",
  persentase_share: 100,
  coas_role: "leader" as const, // for non-coas can be fixed/ignored
  id_perusahaan_asuransi: "", 
  detail_premi: emptyDetailPremi,
  detail_komisi: emptyDetailKomisi,
};

const nonCoasDefault = {
  jenis_coas: 'non-coas' as const,
  shares: emptyShare,
};

const coasDefault = {
    jenis_coas: 'coas' as const,
    shares: [{...emptyShare, persentase_share: 50},{...emptyShare, persentase_share: 50}]
};

export function getDefaultValues(kind: "coas" | "non-coas" = "non-coas") {
  return {
    ...baseDefault,
    ...(kind === "coas" ? coasDefault : nonCoasDefault),
  };
}