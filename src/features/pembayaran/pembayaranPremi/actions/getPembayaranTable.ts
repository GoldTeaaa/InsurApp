"use server";

import { supabase } from "@/lib/supabase";
import { ActionReturnState, TableParams } from "@/lib/types";
import { PembayaranTableRow } from "@/lib/pembayaran/pembayaran_premi/types";

type ReturnState = ActionReturnState<PembayaranTableRow[]>;

export default async function getPembayaranTableData({
  search,
  page,
  size,
  status,
}: TableParams): Promise<ReturnState> {
  const { data, error } = await supabase.rpc("premi_pembayaran_table", {
    p_search: search,
    p_page: page,
    p_size: size,
    p_status: status,
  });

  if (error) return {
    success: false,
    message: error.message,
  };

  return {
    success: true,
    message: "Success",
    data: data as PembayaranTableRow[],
  };
}
