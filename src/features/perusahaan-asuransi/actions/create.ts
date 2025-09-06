"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import {
  perusahaanCreateToRpcSchema,
  perusahaanCreateResultArraySchema,
} from "@/lib/perusahaan_asuransi/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreatePerusahaanState = {
  success: boolean;
  id?: string;
  nama?: string;
  message?: string | null;
  errors?: Record<string, string[]>;
};

export async function createPerusahaanAction(
  _prev: CreatePerusahaanState,
  formData: FormData
): Promise<CreatePerusahaanState> {
  // 1) Build a plain object; ensure non-string entries (File) don't break Zod
  const raw = Object.fromEntries(
    Array.from(formData.entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""])
  );

  // 2) Validate & map to exact RPC params with Zod
  const rpcParams = perusahaanCreateToRpcSchema.safeParse(raw);
  if (!rpcParams.success) {
    return {
      success: false,
      message: "Periksa kembali input.",
      errors: rpcParams.error.flatten().fieldErrors,
    };
  }

  // 3) Create a server-side Supabase client bound to cookies (auth.uid() for created_by/updated_by)
  const cookieStore = cookies();

  // Optional: enforce signed-in if you expect auth.uid() (else created_by will be NULL)
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) {
  //   return { success: false, message: "Silakan login untuk membuat perusahaan." };
  // }

  // 4) Call RPC
  const { data, error } = await supabase.rpc("perusahaan_asuransi_create_v1", rpcParams.data);

  if (error) {
    // Inline mapping for common DB messages (no separate helper)
    const msg = error.message || "Gagal menyimpan.";
    const errors: Record<string, string[]> = {};

    // Your SQL raises 'Nama perusahaan sudah terdaftar' on unique_violation
    if (/sudah terdaftar/i.test(msg)) {
      errors.nama = ["Nama perusahaan sudah terdaftar."];
    }
    // Your SQL also raises 'Nama perusahaan wajib diisi...' if that ever bubbles up
    if (/wajib diisi/i.test(msg)) {
      errors.nama = [...(errors.nama ?? []), msg];
    }

    return { 
      success: false, 
      message: msg, 
      errors: Object.keys(errors).length ? errors : { rpc: [msg] } 
    };
  }

  // 5) Parse RPC result (fail-fast if shape drifts)
  let rowId = "";
  let rowNama = "";
  try {
    const rows = perusahaanCreateResultArraySchema.parse(data ?? []);
    rowId = rows[0].id;
    rowNama = rows[0].nama_asuransi;
  } catch (e: any) {
    return {
      success: false,
      message: "Format respons server tidak sesuai.",
      errors: { rpc: [String(e?.message ?? e)] },
    };
  }

  // 6) Optional: revalidate the list page so the new row appears immediately
  revalidatePath("/dashboard/perusahaan-asuransi"); // adjust if your route differs
  redirect("/dashboard/perusahaan-asuransi/");

  return {
    success: true,
    id: rowId,
    nama: rowNama,
    message: "Perusahaan berhasil dibuat.",
  };
}
