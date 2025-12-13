import {
  LaporanProduksiTable,
  GroupedProduksiData,
} from "@/lib/laporan/laporan-produksi/types";

/**
 * Transforms a flat array of policy share data into a nested structure,
 * grouping shares by their `nomor_polis`.
 *
 * @param data - An array of flat production data objects from the API.
 * @returns An array of grouped production data, where each object represents a unique policy
 *          with an array of its associated shares.
 */
export default function transformProduksiData(
  data: LaporanProduksiTable
): GroupedProduksiData[] {
  if (!data || data.length === 0) {
    return [];
  }

  const polisMap = new Map<string, GroupedProduksiData>();

  for (const item of data) {
    if (!polisMap.has(item.nomor_polis)) {
      polisMap.set(item.nomor_polis, {
        nomor_polis: item.nomor_polis,
        periode_mulai: item.periode_mulai,
        periode_akhir: item.periode_akhir,
        nama_tertanggung: item.nama_tertanggung,
        jenis_bisnis: item.jenis_bisnis,
        jenis_coas: item.jenis_coas,
        polis_shares: [], // Initialize the shares array
      });
    }

    const share = {
      polis_share_id: item.polis_share_id,
      nama_perusahaan_asuransi: item.nama_perusahaan_asuransi,
      share: item.share,
      premi: {
        bruto: item.premi,
        discount: item.discount,
        biaya_admin_materai: item.biaya_admin_materai,
        net: item.premi_net,
      },
      komisi: {
        no_kwitansi: item.no_kwitansi_komisi,
        bruto: item.komisi,
        pph: item.pph_komisi,
        net: item.komisi_net,
      },
    };

    // Add the new share to the correct policy's `polis_shares` array.
    polisMap.get(item.nomor_polis)!.polis_shares.push(share);
  }

  // Convert the map values back to an array for the final result.
  return Array.from(polisMap.values());
}
