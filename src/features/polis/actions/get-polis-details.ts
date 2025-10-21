'use server';
import { GetPolisSchema, ViewPolisSchema } from "@/lib/polis/get-types";
import { supabase } from "@/lib/supabase";
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
  const { data, error } = await supabase.rpc("get_polis_details", {
    p_polis_id: id,
  });

  console.log("data before PARSE: ", data);
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

  return {
    success: true,
    message: "Success",
    data: formattedData,
  };
}
