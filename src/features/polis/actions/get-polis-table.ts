"use server";
import { ActionReturnState } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { PolisTableQuery } from "@/lib/polis/table-types";
import { PolisTableRow } from "@/lib/polis/table-types";

type ReturnState = ActionReturnState<PolisTableRow[]>;

export default async function getPolisTableData({
  search,
  page,
  size,
}: PolisTableQuery): Promise<ReturnState> {
  const { data, error } = await supabase.rpc("polis_table", {
    p_search: search,
    p_page: page,
    p_size: size,
  });

  if (error) {
    console.error(error);
    return { success: false, message: "Failed to fetch polis table data." };
  }

  if (!data) {
    return { success: true, message: "Success", data: [] };
  }

  // Aggregate rows to handle co-insurance policies with multiple insurers
  const aggregatedData = new Map<string, PolisTableRow>();

  (data as PolisTableRow[]).forEach((row) => {
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

  const processedData = Array.from(aggregatedData.values());

  return {
    success: true,
    message: "Success",
    data: processedData,
  };
}
