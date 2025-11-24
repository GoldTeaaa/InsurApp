"use server";
import {
  AgingKomisiSearchParamsSchema,
  type LaporanAgingKomisiRPCPayload,
  LaporanAgingKomisiRPCPayloadSchema,
} from "@/lib/laporan/laporan-aging-komisi/types";
import { supabase } from "~/utils/supabase/client";
import { ActionReturnState } from "@/lib/types";
import { SearchParamsProps } from "@/lib/laporan/laporan-aging-premi/types";

type ReturnState = ActionReturnState<LaporanAgingKomisiRPCPayload>;

export default async function getLapAgingKomisiData({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}): Promise<ReturnState> {
  const params = await searchParams;
  const parsedParams = AgingKomisiSearchParamsSchema.safeParse(params);
  if (!parsedParams.success) {
    return {
      success: false,
      message: parsedParams.error.message,
    };
  }

  const { search, page, size, date_from, date_to } = parsedParams.data;

  const { data, error } = await supabase.rpc("get_laporan_aging_komisi", {
    p_search: search,
    p_page: page,
    p_size: size,
    p_date_from: date_from,
    p_date_to: date_to,
  });

  if (error) {
    console.error("Supabase RPC error:", error.message);
    return {
      success: false,
      message: "Failed to fetch report data from the database.",
    };
  }

  const parsedPayload = LaporanAgingKomisiRPCPayloadSchema.safeParse(data);
  if (!parsedPayload.success) {
    console.error("Zod validation error:", parsedPayload.error.message);
    return {
      success: false,
      message: "Received unexpected data structure from the database.",
    };
  }

  return {
    success: true,
    message: "",
    data: parsedPayload.data,
  };
}
