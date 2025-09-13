"use server";

import {
  perusahaanCreateResultArraySchema,
  perusahaanCreateFormSchema,
  perusahaanCreateToRpcSchema,
  type PerusahaanCreateResult,
} from "@/lib/perusahaan_asuransi/types";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { ActionReturnState } from "@/lib/types";

export type CreateState = ActionReturnState<PerusahaanCreateResult>;

export async function createPerusahaan(

  _prevState: CreateState,
  formData: FormData
): Promise<CreateState> {
  
  // 1. Validate
  console.log("formData: ", formData);
  const parsed = perusahaanCreateFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // 2. Transform to RPC parameters
  const rpcParams = perusahaanCreateToRpcSchema.parse(parsed.data);
  console.log("rpcParams: ", rpcParams);

  // 3. Call Supabase RPC
  const { data, error } = await supabase.rpc("perusahaan_asuransi_create_v1", rpcParams);
  if (error) {
    return { success: false, message: `Gagal menyimpan: ${error.message}` };
  }

  // 4. Parse RPC result
  const result = perusahaanCreateResultArraySchema.safeParse(data);
  if (!result.success || result.data.length === 0) {
    return {
      success: false,
      message: "Gagal memproses respons dari server.",
      errors: { rpc: ["Format data tidak valid."] },
    };
  }

  revalidatePath("/dashboard/perusahaan-asuransi");
  return {
    success: true,
    message: "Perusahaan asuransi berhasil ditambahkan.",
    data: result.data[0],
  };
}