import { ActionReturnState } from "@/lib/types";
import { createClient } from "~/utils/supabase/server";
import { polisCardStatSchema, type PolisCardStatType } from "../schema/polis-card-prop";

type ReturnState = ActionReturnState<PolisCardStatType>;

export default async function getPolisCardStats(): Promise<ReturnState> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("dashboard_card_view")
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const parsedData = polisCardStatSchema.safeParse(data);

  if(!parsedData.success) {
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
