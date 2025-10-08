'use server';
import { ActionReturnState } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { PolisTableQuery } from "@/lib/polis/table-types";

type PolisTableRow = {
  id: string;
  nomor_polis: string;
  bisnis: string;
  nama_nasabah: string | null;
  total_premi: number | null;
  periode_mulai: string;
  periode_akhir: string;
  nama_perusahaan_asuransi: string | null;
  full_count: number;
};

type ReturnState = ActionReturnState<PolisTableRow[]>;

export default async function getPolisTableData({search, page, size}: PolisTableQuery): Promise<ReturnState> {
  const { data, error } = await supabase.rpc("polis_table",{
    p_search: search,
    p_page: page,
    p_page_size: size
  });

  if (error) {
    console.error(error);
    return { success: false, message: "Failed to fetch polis table data." };
  }

  console.log("data: ", data);
  return { success: true, message: "Success", data: data as PolisTableRow[] };
}