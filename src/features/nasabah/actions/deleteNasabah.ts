'use server';
import { supabase } from "~/utils/supabase/client";
import { revalidatePath } from "next/cache";

export async function deleteNasabahAction(formData: FormData) {
  console.log("Delete FormData From Server: ", formData);
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");

  const { error } = await supabase.rpc("nasabah_delete_v1", { p_id: id });
  if (error) throw new Error(error.message);
  
  revalidatePath("/dashboard/nasabah"); // adjust to your route
}