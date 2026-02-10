import z from "zod";

export const NasabahTableRow = z.object({
  nasabah_id: z.string(),
  tipe: z.string(),
  nama: z.string(),
  contact_1: z.string(),
  contact_2: z.string().nullable(),
  email: z.string().email().nullable(),
  alamat: z.string().nullable(),
  created_at: z.string(),
  // updated_at: z.string(),
  jumlah_polis: z.number(),
});

export const NasabahTableRowsSchema = z.array(NasabahTableRow);

export const NasabahTableRPCSchema = z.object({
  rows: NasabahTableRowsSchema,
  total_count: z.number(),
})

export type NasabahTableRow = z.infer<typeof NasabahTableRow>;
export type NasabahTableRows = z.infer<typeof NasabahTableRowsSchema>;
export type NasabahTableRPC = z.infer<typeof NasabahTableRPCSchema>;