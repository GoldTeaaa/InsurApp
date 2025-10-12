import {
  basePolisObjectSchema,
  DetailKomisiSchema,
  DetailPremiSchema,
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

export type GetPolisShareSchema = z.infer<typeof ViewPolisShareSchema>;
export type GetPolisSchema = z.infer<typeof ViewPolisSchema>;
