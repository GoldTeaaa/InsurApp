import { ActionReturnState } from "@/lib/types";
import { dashboardCardDataSchema, DashboardCardDataType } from "../schema/dashboardCardStatsSchema";
import { createClient } from "~/utils/supabase/server";

type ReturnState = ActionReturnState<DashboardCardDataType>;

export default async function getDashboardCardStats(): Promise<ReturnState> {
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
  
  const parsedData = dashboardCardDataSchema.safeParse(data);

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
