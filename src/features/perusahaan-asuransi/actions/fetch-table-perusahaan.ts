"use server";
import { supabase } from "~/utils/supabase/client";
import {
  perusahaanListParamsSchema,
  perusahaanRowsSchema,
  type PerusahaanRow,
  type PerusahaanSort,
} from "@/lib/perusahaan_asuransi/types";

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
}): Promise<{ rows: PerusahaanRow[]; total: number; pageCount: number }> {
  const params = perusahaanListParamsSchema.parse({
    p_search: search? search.trim() : undefined,
    p_page: Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1,
    p_page_size: size,
    p_sort: sort,
  });

  const { data, error } = await supabase.rpc(
    "perusahaan_asuransi_list_v1",
    params
  );
  if (error) {
    // Surface safe error; you can map messages if needed
    throw new Error(error.message || "Gagal memuat data perusahaan.");
  }

  const rows = perusahaanRowsSchema.parse(data ?? []) as PerusahaanRow[];
  const total = rows.length > 0 ? rows[0].total_count : 0;
  const pageCount = Math.max(1, Math.ceil(total / params.p_page_size));

  return { rows, total, pageCount };
}
