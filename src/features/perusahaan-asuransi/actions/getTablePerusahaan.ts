"use server";
import { createClient } from "~/utils/supabase/server";
import {
  perusahaanListParamsSchema,
  PerusahaanRpcPayload,
  type PerusahaanSort,
} from "@/lib/perusahaan_asuransi/types";
import { ActionReturnState } from "@/lib/types";

type ReturnState = ActionReturnState<PerusahaanRpcPayload>;

export async function fetchPerusahaanPage({
  search,
  page,
  sort,
  size
}: {
  search: string | null;
  page: number;
  sort?: PerusahaanSort;
  size: number;
}): Promise<ReturnState> {
  const supabase = await createClient();
  const params = perusahaanListParamsSchema.parse({
    p_search: search? search.trim() : undefined,
    p_page: Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1,
    p_size: size > 0 ? size : 10,
    p_sort: sort,
  });

  const { data, error } = await supabase.rpc(
    "perusahaan_asuransi_table_list",
    params
  );
  if (error) {
    throw new Error(error.message || "Gagal memuat data perusahaan.");
  }

  return {
    success: true,
    message: "Success",
    data
  }
}
