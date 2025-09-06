"use server";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function deletePerusahaanAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const p_hard = String(formData.get("hard") || "false");
  if (!id) throw new Error("Missing id");

  const { data, error } = await supabase.rpc("perusahaan_asuransi_delete_v1", {
    p_hard,
    p_id: id,
  });
  if (error) console.error(error);
  else console.log(data);

  revalidatePath("/dashboard/perusahaan-asuransi");
  redirect("/dashboard/perusahaan-asuransi");
}
