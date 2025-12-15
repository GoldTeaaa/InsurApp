"use server";
import { createClient } from "~/utils/supabase/server";
import {
  perusahaanFormSchema,
  type PerusahaanForm,
} from "@/lib/perusahaan_asuransi/types";
import { ActionReturnState } from "@/lib/types";

type ReturnState = ActionReturnState<PerusahaanForm>;

export async function getPerusahaanAsuransiById(
  id: string
): Promise<ReturnState> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("perusahaan_asuransi")
    .select("*")
    .eq("id", id)
    .filter("deleted_at", "is", null)
    .limit(1);
    
  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const parsedData = perusahaanFormSchema.safeParse(data[0]);
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
