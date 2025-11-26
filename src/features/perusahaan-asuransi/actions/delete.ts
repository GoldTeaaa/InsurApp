"use server";
import { supabase } from "~/utils/supabase/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ActionReturnState } from "@/lib/types";

// export default async function deletePerusahaanAction(formData: FormData) {
//   const id = String(formData.get("id") || "");
//   const p_hard = String(formData.get("hard") || "false");
//   if (!id) throw new Error("Missing id");

//   const { data, error } = await supabase.rpc("perusahaan_asuransi_delete_v1", {
//     p_hard,
//     p_id: id,
//   });
//   if (error) console.error(error);
//   else console.log(data);

//   revalidatePath("/dashboard/perusahaan-asuransi");
//   redirect("/dashboard/perusahaan-asuransi");
// }

type ReturnState = ActionReturnState<{
  nama_perusahaan: string,
  id: string,
  deleted_at: Date,
  hard: boolean
}>;

export default async function deletePerusahaanAction(id: string): Promise<ReturnState> {
  const { data, error } = await supabase.rpc("perusahaan_asuransi_delete", {
    // p_hard,
    p_id: id,
  });

  if(error) {
    return{
      success: false,
      message: error.message
    }
  }

  return{
    success: true,
    message: `Successfully delete ${data[0].nama_perusahaan}`
  } 
}
