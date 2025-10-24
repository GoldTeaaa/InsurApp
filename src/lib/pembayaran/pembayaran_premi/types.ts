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
  nomor_polis: string;
  nama_tertanggung: string;
  asuransi_penanggung: string;
  tanggal_input: string;
  amount: number;
  total_paid: number;
  remaining: number;
  status: string;
};