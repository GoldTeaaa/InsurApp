import { NasabahRow, NasabahSort } from "@/lib/nasabah/types";
import { supabase } from "@/lib/supabase";

const ITEMS_PER_PAGE = 5 as const;

export async function fetchNasabahPage({
  search = "",
  page = 1,
  sort = "created_asc",
}: {
  search?: string;
  page?: number;
  sort?: NasabahSort;
}) {
  const { data, error } = await supabase.rpc("nasabah_pagination_v1", {
    p_q: search.trim(),
    p_page: page,
    p_page_size: ITEMS_PER_PAGE,
    p_sort: sort,
  });

  if (error) throw new Error(`nasabah_pagination_v1: ${error.message}`);

  const rows= (data ?? []) as (NasabahRow & { total_count: number })[];
  const total = rows[0]?.total_count ?? 0;

  return {
    rows,
    total,
    page,
    pageSize: ITEMS_PER_PAGE,
    pageCount: Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
  };
}