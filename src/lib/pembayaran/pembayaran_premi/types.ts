enum status {
    paid = 'paid',
    unpaid = 'unpaid',
    partially_paid = 'partially_paid'
}

export type PembayaranPremiProps = {
    search?: string;
    page?: number;
    size?: number;
    status?: string
}

export type PembayaranTableRow = {
  id: string;
  nomor_polis: string;
  nama_tertanggung: string;
  asuransi_penanggung: string;
  tanggal_input: string;
  amount: number;
  total_paid: number;
  remaining: number;
  status: string;
  total_count: number;
};

export type PremiHistoryRow = {
  nomor_polis: string;
  amount_paid: number;
  tanggal_bayar: string;
  cara_bayar: string;
  rekening_bank: string;
  ref_no: string;
};