const baseDefault = {
  nomor_polis: "",
  bisnis: undefined,
  id_nasabah: "",
  total_sum_insured: "" as unknown as number,
  nilai_rate: "" as unknown as number,
  jenis_rate: "mille" as const,
  total_premi: "" as unknown as number,
  periode_mulai: "" as unknown as Date,
  periode_akhir: "" as unknown as Date,
  detail_bisnis: {},
  bisnis_details: { bisnis: undefined },
};

const emptyDetailPremi = {
  premi_gross: "" as unknown as number,
  discount: "" as unknown as number,
  biaya_admin_materai: "" as unknown as number,
  premi_net: "" as unknown as number,
};

const emptyDetailKomisi = {
  komisi_gross: "" as unknown as number,
  pph_komisi: "" as unknown as number,
  komisi_net: "" as unknown as number,
};

const emptyShare = {
  persentase_share: 100,
  coas_role: "leader" as const, // for non-coas can be fixed/ignored
  id_perusahaan_asuransi: "",
  detail_premi: emptyDetailPremi,
  detail_komisi: emptyDetailKomisi,
};

const nonCoasDefault = {
  jenis_coas: "non-coas" as const,
  shares: emptyShare,
};

const coasDefault = {
  jenis_coas: "coas" as const,
  shares: [
    // Indicating must be more than one box
    { ...emptyShare, persentase_share: "" as unknown as number },
    { ...emptyShare, persentase_share: "" as unknown as number },
  ],
};

export function getDefaultValues(kind: "coas" | "non-coas" = "non-coas") {
  return {
    ...baseDefault,
    ...(kind === "coas" ? coasDefault : nonCoasDefault),
  };
}
