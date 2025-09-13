// features/perusahaan-asuransi/queries/get-by-id.ts
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import {
  perusahaanFormSchema,
  type PerusahaanForm,
} from "@/lib/perusahaan_asuransi/types";

const IdSchema = z.string().uuid();

export async function getPerusahaanAsuransiById(
  id: string
): Promise<PerusahaanForm | null> {
  if (!IdSchema.safeParse(id).success) return null;

  const { data, error } = await supabase.rpc("perusahaan_asuransi_get_v1", { p_id: id });
  if (error) return null;

  const row = Array.isArray(data) ? data[0] : null;
  if (!row) return null;

  const parsed = perusahaanFormSchema.safeParse(row);
  return parsed.success ? parsed.data : null;
}
