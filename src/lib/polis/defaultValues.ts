const baseDefault = {
  nomor_polis: "",
  bisnis: undefined,
  id_nasabah: "",
  total_sum_insured: undefined,
  nilai_rate: undefined,
  jenis_rate: "mille" as const,
  total_premi: undefined,
  periode_mulai: undefined,
  periode_akhir: undefined,
  detail_bisnis: {},
};

const emptyDetailPremi = {
  premi_gross: 0,
  discount: 0,
  biaya_admin_materai: 0,
  premi_net: 0,
};

const emptyDetailKomisi = {
  komisi_gross: 0,
  pph_komisi: 0,
  komisi_net: 0,
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
    //Indicating must be more than one box
    { ...emptyShare, persentase_share: 0 },
    { ...emptyShare, persentase_share: 0 },
  ],
};

export function getDefaultValues(kind: "coas" | "non-coas" = "non-coas") {
  return {
    ...baseDefault,
    ...(kind === "coas" ? coasDefault : nonCoasDefault),
  };
}
