"use server";
import {
    perusahaanUpdateFormSchema, 
    perusahaanUpdateRpcParamsSchema, 
    type PerusahaanUpdateFormValues,
    type PerusahaanUpdateParams,
    type PerusahaanReturnResult
} from "@/lib/perusahaan_asuransi/types";
import { supabase } from "~/utils/supabase/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionReturnState } from "@/lib/types";

function toUpdateRpc(v: PerusahaanUpdateFormValues): PerusahaanUpdateParams {
  return {
    p_id: v.id,
    p_nama: v.nama?.trim(),
    p_email: v.email ?? null,
    p_alamat: v.alamat ?? null,
    p_kontak_1: v.kontak_1 ?? null,
    p_kontak_2: v.kontak_2 ?? null,
  };
}

export type ReturnState = ActionReturnState<PerusahaanReturnResult>;

export async function updatePerusahaanAction(
  id: string,
  _prev: ReturnState,
  formData: FormData
): Promise<ActionReturnState> {
  // 1) Shape FormData to a plain object that matches the UI schema
  const shaped: PerusahaanUpdateFormValues = {
    id: id,
    nama: String(formData.get("nama") ?? ""),
    email: ((): string | null => {
      const v = formData.get("email");
      return typeof v === "string" ? v : "";
    })(),
    alamat: ((): string | null => {
      const v = formData.get("alamat");
      return typeof v === "string" ? v : "";
    })(),
    kontak_1: ((): string | null => {
      const v = formData.get("kontak_1");
      return typeof v === "string" ? v : "";
    })(),
    kontak_2: ((): string | null => {
      const v = formData.get("kontak_2");
      return typeof v === "string" ? v : "";
    })(),
  };

  // 2) Validate UI shape
  const parsed = perusahaanUpdateFormSchema.safeParse(shaped);
  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali input",
      errors: parsed.error.flatten().fieldErrors,
    };
    // example: { nama: ["Nama wajib diisi (min 3 karakter)"], email: ["Format email tidak valid"] }
  }

  // 3) Map to RPC params and validate that too (defense in depth)
  const rpcParams = perusahaanUpdateRpcParamsSchema.parse(toUpdateRpc(parsed.data));

  // 4) Call RPC
  const { error } = await supabase.rpc("perusahaan_asuransi_update_v1", rpcParams);
  if (error) {
    return {
      success: false,
      message: error.message ?? "Gagal menyimpan perubahan",
    };
  }
  
  revalidatePath("/dashboard/perusahaan-asuransi");
  redirect("/dashboard/perusahaan-asuransi");
}