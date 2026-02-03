import { PerusahaanStatCardDataSchema, PerusahaanStatCardType } from "@/lib/perusahaan_asuransi/types/perusahaan-card-data";
import { ActionReturnState } from "@/lib/types";
import { createClient } from "~/utils/supabase/server";

type ReturnState = ActionReturnState<PerusahaanStatCardType>;

export async function getTotalPolisForPerusahaanWithId(
  id: string,
): Promise<ReturnState> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("v_perusahaan_asuransi_stat_card")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const parsedData = PerusahaanStatCardDataSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: false,
      message: parsedData.error.message,
    };
  }

  return {
    success: true,
    message: "Success",
    data: parsedData.data,
  };
}
