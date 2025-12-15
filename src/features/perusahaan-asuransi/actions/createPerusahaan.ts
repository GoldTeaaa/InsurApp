"use server";
import {
  perusahaanCreateResultArraySchema,
  perusahaanFormSchema,
  perusahaanCreateToRpcSchema,
  type PerusahaanReturnResult,
} from "@/lib/perusahaan_asuransi/types";
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";

export type ReturnState = ActionReturnState<PerusahaanReturnResult>;

export async function createPerusahaan(
  _prevState: ReturnState,
  formData: FormData
): Promise<ReturnState> {
  const supabase = await createClient();

  const parsed = perusahaanFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }
  console.log("parsed.data: ", parsed.data);

  const rpcParams = perusahaanCreateToRpcSchema.parse(parsed.data);

  const { data, error } = await supabase.rpc("perusahaan_asuransi_create_v1", rpcParams);
  if (error) {
    return { success: false, message: `Gagal menyimpan: ${error.message}` };
  }

  const result = perusahaanCreateResultArraySchema.safeParse(data);
  if (!result.success || result.data.length === 0) {
    return {
      success: false,
      message: "Gagal memproses respons dari server.",
      errors: { rpc: ["Format data tidak valid."] },
    };
  }

  return {
    success: true,
    message: "Perusahaan asuransi berhasil ditambahkan.",
    data: result.data[0],
  };
}