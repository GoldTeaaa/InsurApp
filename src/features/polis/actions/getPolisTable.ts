"use server";
import { ActionReturnState, jenis_coas } from "@/lib/types";
import { createClient } from "~/utils/supabase/server";
import {
  PolisRow,
  polisSearchSchema,
  polisTableRowSchema,
  polisTableSchema,
  PolisTableSearchParams,
} from "@/features/polis/schema/table-types";
import { PolisTableType } from "@/features/polis/schema/table-types";
// import { Polis } from "@/lib/polis/create-types";

type ReturnState = ActionReturnState<PolisTableType>;

export default async function getPolisTableData({
  searchParams,
}: {
  searchParams: PolisTableSearchParams;
}): Promise<ReturnState> {
  const supabase = await createClient();
  const params = await searchParams;

  const parsedSchema = polisSearchSchema.safeParse(params).data;
  const { search, page, size, jenis_bisnis, jenis_coas, date_from, date_to } =
    parsedSchema as PolisTableSearchParams;

  const { data, error } = await supabase.rpc("polis_table_route", {
    p_search: search,
    p_page: page,
    p_size: size,
    p_jenis_bisnis: jenis_bisnis,
    p_jenis_coas: jenis_coas,
    p_date_from: date_from,
    p_date_to: date_to,
  });

  if (error) {
    console.error('Error fetching polis table data:', error.message);
    return {
      success: false,
      message: "Failed to fetch polis table data.",
    };
  }

  const parsedData = polisTableSchema.safeParse(data);

  if (!parsedData.success) {
    console.error("Zod validation failed:", parsedData.error);
    return {
      success: false,
      message: "Invalid data structure from API.",
    };
  }

  return {
    success: true,
    message: "Success",
    data: parsedData.data,
  };
}
