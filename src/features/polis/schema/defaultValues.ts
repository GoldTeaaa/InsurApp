const baseDefault = {
  nomor_polis: "",
  bisnis: undefined,
  id_nasabah: "",
  total_sum_insured: "",
  nilai_rate: "",
  jenis_rate: "mille" as const,
  total_premi: "",
  periode_mulai: undefined,
  periode_akhir: undefined,
  detail_bisnis: {},
  bisnis_details: { bisnis: undefined },
};

const emptyDetailPremi = {
  premi_gross: "",
  discount: "",
  biaya_admin_materai: "",
  premi_net: "",
};

const emptyDetailKomisi = {
  komisi_gross: "",
  pph_komisi: "",
  komisi_net: "",
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
