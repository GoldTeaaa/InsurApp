'use server';
import { GetPolisSchema, ViewPolisSchema } from "@/features/polis/schema/get-types";
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";

const formatDateForInput = (date: string | Date | null | undefined): string => {
  if (!date) return "";
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch (error) {
    return "";
  }
};

type ReturnState = ActionReturnState<GetPolisSchema>;

export default async function getPolisDetails(
  id: string
): Promise<ReturnState> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_polis_details", {
    p_polis_id: id,
  });

  if (error){
    return{
      success : false,
      message : error.message
    }
  }

  const parsedData = ViewPolisSchema.safeParse(data);
  if (!parsedData.success) {
    console.error("Zod validation failed:", parsedData.error.flatten());
    return {
      success: false,
      message: "Invalid data structure from API.",
    };
  }

  const formattedData = {
    ...parsedData.data,
    periode_mulai: formatDateForInput(parsedData.data.periode_mulai),
    periode_akhir: formatDateForInput(parsedData.data.periode_akhir),
  };

  console.log('Formatted Update Data: ', parsedData.data);

  return {
    success: true,
    message: "Success",
    data: formattedData,
  };
}
