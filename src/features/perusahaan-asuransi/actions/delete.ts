"use server";
import { supabase } from "~/utils/supabase/client";
import { ActionReturnState } from "@/lib/types";

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
