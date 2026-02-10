import { defaultTableNasabahDetailSchemaArray, type DefaultTableSchemaArrayType } from "@/lib/nasabah/nasabah-card/default-table-type";
import { ActionReturnState } from "@/lib/types";
import { createClient } from "~/utils/supabase/server";

type Props = {
  id: string;
};

type ReturnState = ActionReturnState<DefaultTableSchemaArrayType>;

export default async function getNasabahPolisList({
  id,
}: Props): Promise<ReturnState> {

  const supabase = await createClient();

  const {data, error} = await supabase.from("nasabah_polis_detail")
  .select("*")
  .eq("nasabah_id", id);

  if(error){
    return {
      success: false,
      message: error.message
    }
  }

  const {data: parsedData, error: parsedDataError} = defaultTableNasabahDetailSchemaArray.safeParse(data);

  if(parsedDataError){
    return {
      success: false,
      message: parsedDataError.message
    }
  }

  return {
    success: true,
    message: "Successfully retrieved nasabah polis list.",
    data: parsedData,
  }
}
