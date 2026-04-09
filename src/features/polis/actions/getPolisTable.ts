"use server";
import { ActionReturnState, jenis_coas } from "@/lib/types";
import { createClient } from "~/utils/supabase/server";
import {
  PolisRow,
  polisSearchSchema,
  PolisTableSearchParams,
} from "@/features/polis/schema/table-types";
import { PolisTableRow } from "@/features/polis/schema/table-types";
// import { Polis } from "@/lib/polis/create-types";

type ReturnState = ActionReturnState<PolisTableRow>;

export default async function getPolisTableData({
  searchParams,
}: {
  searchParams: PolisTableSearchParams;
}): Promise<ReturnState> {
  const supabase = await createClient();
  const params = await searchParams;

  const parsedData = polisSearchSchema.safeParse(params).data;
  const { search, page, size, jenis_bisnis, jenis_coas, date_from, date_to } =
    parsedData as PolisTableSearchParams;

  const { data, error } = await supabase.rpc("polis_table_route", {
    p_search: search,
    p_page: page,
    p_size: size,
    p_jenis_bisnis: jenis_bisnis,
    p_jenis_coas: jenis_coas,
    p_date_from: date_from,
    p_date_to: date_to,
  });

  if (error) {
    console.error("Error fetching polis table data:", error.message);
    return {
      success: false,
      message: "Failed to fetch polis table data.",
    };
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
          row.nama_perusahaan_asuransi,
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
