"use server";

import { supabase } from "@/lib/supabase";
import { ActionReturnState } from "@/lib/types";
import { PembayaranTableRow } from "@/lib/pembayaran/pembayaran_premi/types";

type PembayaranTableParams = {
  search?: string;
  page?: number;
  size?: number;
  status?: string;
};

type ReturnState = ActionReturnState<PembayaranTableRow[]>;

export default async function getPembayaranTableData({
  search,
  page,
  size,
  status,
}: PembayaranTableParams): Promise<ReturnState> {
  const { data, error } = await supabase.rpc("pembayaran_table", {
    p_search: search,
    p_page: page,
    p_size: size,
    p_status: status,
  });

  if (error) throw new Error(error.message);

  return {
    success: true,
    message: "Success",
    data: data as PembayaranTableRow[],
  };
}
