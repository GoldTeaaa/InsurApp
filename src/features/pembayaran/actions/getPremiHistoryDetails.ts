"use server";
import { PremiHistoryRow } from "@/lib/pembayaran/pembayaran_premi/types";
import { supabase } from "@/lib/supabase";
import { ActionReturnState } from "@/lib/types";

type ReturnState = ActionReturnState<PremiHistoryRow[]>;

export default async function getPremiHistoryDetails({
  detailPremiId,
}: {
  detailPremiId: string;
}): Promise<ReturnState> {
  const { data, error } = await supabase
    .from("pembayaran_history_view")
    .select(
      "nomor_polis, amount_paid, tanggal_bayar, cara_bayar, rekening_bank, ref_no"
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
