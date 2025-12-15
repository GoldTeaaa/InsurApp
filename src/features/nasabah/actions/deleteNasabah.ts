'use server';
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";

export async function deleteNasabahAction(id: string): Promise<ActionReturnState> {
  
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("nasabah_delete_v1", { p_id: id });
  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  
  return{
    success: true,
    message: `Successfully delete ${data[0].full_name}`
  }
}