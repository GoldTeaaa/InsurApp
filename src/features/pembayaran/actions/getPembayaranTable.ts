'use server';

import { supabase } from "@/lib/supabase";
import { ActionReturnState } from "@/lib/types";
type PembayaranTableParams = {
  search?: string;
  page?: number;
  size?: number;
  status?: string;
};

export type PembayaranTableRow = {
  nomor_polis: string;
  nama: string;
  created_at: string;
  premi_net: number;
  status: string;
}

type ReturnState = ActionReturnState<PembayaranTableRow[]>;

export default async function getPembayaranTableData(
  { search, page = 1, size = 10, status }: PembayaranTableParams
): Promise<ReturnState> {
  const { data, error } = await supabase.rpc('pembayaran_table', {
    p_search: search,
    p_page: page,
    p_size: size,
    p_status: status,
  });
  console.log('data: ', data);

  if (error) throw new Error(error.message);

  return {
    success: true,
    message: "Success",
    data: data as PembayaranTableRow[],
  };

}