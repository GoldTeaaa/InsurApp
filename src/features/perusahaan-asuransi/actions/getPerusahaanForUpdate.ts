"use server";
import { createClient } from "~/utils/supabase/server";
import {
  perusahaanFormSchema,
  type PerusahaanFormType,
} from "@/lib/perusahaan_asuransi/types";
import { ActionReturnState } from "@/lib/types";

type ReturnState = ActionReturnState<PerusahaanFormType>;

export async function getPerusahaanAsuransiById(
  id: string
): Promise<ReturnState> {

  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("perusahaan_asuransi")
    .select("*")
    .eq("id", id)
    .filter("deleted_at", "is", null)
    .single();
    // Limit still return array, use single to return single  object
    //.limit(1);
    
  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (!data) {
    return {
      success: true,
      message: "Data not found",
    };
  }

  console.log("id: ", id);
  console.log("data: ", data);

  const parsedData = perusahaanFormSchema.safeParse(data);
  
  if (!parsedData.success) {
    return {
      success: false,
      message: "Invalid data structure from API. " + parsedData.error.message,
    };
  }

  return {
    success: true,
    message: "Success",
    data: parsedData.data,
  };
}
