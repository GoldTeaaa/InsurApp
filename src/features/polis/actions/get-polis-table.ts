"use server";
import { ActionReturnState, JenisBisnis } from "@/lib/types";
import { supabase } from "~/utils/supabase/client";
import { PolisRow, PolisTableSearchParams } from "@/lib/polis/table-types";
import { PolisTableRow } from "@/lib/polis/table-types";
// import { Polis } from "@/lib/polis/create-types";

type ReturnState = ActionReturnState<PolisTableRow>;

export default async function getPolisTableData({
  searchParams,
}: {
  searchParams: PolisTableSearchParams;
}): Promise<ReturnState> {
  const params = await searchParams;

  const search = params?.search ?? "";
  const page = Number(params?.page ?? 1);
  const size = Number(params?.size ?? 10);
  const jenis_bisnis = params.jenis_bisnis as JenisBisnis ?? null;

  const { data, error } = await supabase.rpc("polis_table_route", {
    p_search: search,
    p_page: page,
    p_size: size,
    p_jenis_bisnis: jenis_bisnis,
  });

  if (error) {
    console.error(error);
    return { success: false, message: "Failed to fetch polis table data." };
  }

  // Aggregate rows to handle co-insurance policies with multiple insurers
  const aggregatedData = new Map<string, PolisRow>();

  (data.rows as PolisRow[]).forEach((row) => {
    const existingRow = aggregatedData.get(row.id);
    if (existingRow) {
      // If the insurer is not null and not already in the list, add it.
      if (
        row.nama_perusahaan_asuransi &&
        !existingRow.nama_perusahaan_asuransi?.includes(
          row.nama_perusahaan_asuransi
        )
      ) {
        existingRow.nama_perusahaan_asuransi += `, ${row.nama_perusahaan_asuransi}`;
      }
    } else {
      // First time seeing this policy ID, add it to the map.
      aggregatedData.set(row.id, { ...row });
    }
  });

  const groupAsuransiPenanggung = Array.from(aggregatedData.values());

  const returnData = {
    rows: groupAsuransiPenanggung,
    total_count: data.total_count,
  };

  return {
    success: true,
    message: "Success",
    data: returnData,
  };
}
