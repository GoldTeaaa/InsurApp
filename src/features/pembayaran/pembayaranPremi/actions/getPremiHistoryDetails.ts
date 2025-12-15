"use server";
import { PremiHistoryRow } from "@/lib/pembayaran/pembayaran_premi/types";
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";

type ReturnState = ActionReturnState<PremiHistoryRow[]>;

export default async function getPremiHistoryDetails(
  detailPremiId: string
): Promise<ReturnState> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pembayaran_history_view")
    .select(
      "detail_premi_id, nomor_polis, amount_paid, tanggal_bayar, cara_bayar, rekening_bank, ref_no, pembayaran_id"
    )
    .eq("detail_premi_id", detailPremiId)
    .order("tanggal_bayar", { ascending: false });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Success",
    data: data,
  };
}
