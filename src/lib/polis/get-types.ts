import {
  basePolisObjectSchema,
  PolisShareSchema,
} from "@/lib/polis/create-types";
import z from "zod";

export const ViewPolisShareSchema = PolisShareSchema.extend({
  id: z.string().uuid(),
});

export const ViewBasePolisSchema = basePolisObjectSchema.extend({
  id: z.string().uuid(),
  periode_mulai: z.string(),
  periode_akhir: z.string(),
});

const nonCoasSchema = ViewBasePolisSchema.extend({
  jenis_coas: z.literal("non-coas"),
  shares: z.array(ViewPolisShareSchema).max(1, "Polis non-coas harus hanya satu anggota."),
});

const coasSchema = ViewBasePolisSchema.extend({
  jenis_coas: z.literal("coas"),
  shares: z.array(ViewPolisShareSchema).min(2, "Polis coas harus lebih dari satu anggota."),
});

export const ViewPolisSchema = z.discriminatedUnion("jenis_coas", [
  nonCoasSchema,
  coasSchema,
]);

export const RefinedViewPolisSchema = ViewPolisSchema.superRefine((data, ctx) => {
  // --- Validation from basePolisSchema ---
  const periodeMulai = data.periode_mulai ? new Date(data.periode_mulai) : null;
  const periodeAkhir = data.periode_akhir ? new Date(data.periode_akhir) : null;

  if (periodeMulai && periodeAkhir && periodeAkhir <= periodeMulai) {
    ctx.addIssue({
      code: "custom",
      message: "Periode akhir harus setelah periode mulai",
      path: ["periode_akhir"],
    });
  }

  if (data.total_premi > data.total_sum_insured + 1e-9) {
    ctx.addIssue({
      code: "custom",
      message: "Total premi tidak boleh melebihi Total Sum Insured.",
      path: ["total_premi"],
    });
  }

  // --- Validation from PolisSchema ---
  const sharesArr = data.shares;

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
        // Note: RHF can't easily target a specific field in an array for a top-level error.
        // This message will appear as a general form error or on the 'shares' field itself.
        path: ["shares"],
      });
    }
  } else {
    // "non-coas" case
    const singleShare = sharesArr[0];
    if (singleShare && singleShare.detail_premi.premi_gross > data.total_premi + 1e-9) {
      ctx.addIssue({
        code: "custom",
        message: "Premi Gross tidak boleh melebihi Total Premi.",
        path: ["shares", 0, "detail_premi", "premi_gross"],
      });
    }
  }
});

export type GetPolisShareSchema = z.infer<typeof ViewPolisShareSchema>;
export type GetPolisSchema = z.infer<typeof RefinedViewPolisSchema>;
