import { NasabahTableRPC, NasabahTableRPCSchema } from "@/lib/nasabah/tableType";
import { NasabahTableSearchParams } from "@/lib/nasabah/type";
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";

type ReturnState = ActionReturnState<NasabahTableRPC>

export default async function fetchNasabahPage({
  searchParams
}: {searchParams: NasabahTableSearchParams}):Promise<ReturnState> {
  
  const supabase = await createClient();
  const params = await searchParams;
  const page = Number(params?.page ?? 1);
  const size = Number(params?.size ?? 10);
  const search = params?.search ?? "";


  const { data, error } = await supabase.rpc("get_nasabah_table", {
    p_search: search,
    p_page: page,
    p_size: size
  });
  
  if(error) return {
    success: false,
    message: error.message,
  }

  const parsedData = NasabahTableRPCSchema.safeParse(data);
  if(!parsedData.success) return {
    success: false,
    message: parsedData.error.message,
  }

  return {
    success: true,
    message: "Success",
    data: parsedData.data
  };
}