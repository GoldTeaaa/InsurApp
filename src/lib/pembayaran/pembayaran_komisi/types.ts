import z from "zod";
import { cara_bayar } from "../pembayaran_premi/types";

export type komisiTableRowData = {
  polis_share_id: string;
  nomor_polis: string;
  nama_nasabah: string;
  nama_perusahaan: string;
  created_at: string;
  komisi_net: number;
  total_paid: number;
  sisa_komisi: number;
  status: string;
};

export type komisiTableData = {
  rows: komisiTableRowData[];
  total_row_count: number;
};

export const HistoryPembayaranKomisiTableRowSchema = z.object({
  nomor_polis: z.string(),
  pembayaran_komisi_id: z.string(),
  detail_komisi_id: z.string(),
  amount_paid: z.coerce.number(),
  cara_bayar: z.enum(cara_bayar),
  tanggal_bayar: z.coerce.date(),
  rekening_bank: z.string().nullable().optional(),
  no_kwitansi: z.string(),
});

export const HistoryPembayaranKomisiTableDataSchema = z.array(
  HistoryPembayaranKomisiTableRowSchema
);

export type HistoryPembayaranKomisiTableRow = z.infer<typeof HistoryPembayaranKomisiTableRowSchema>;
export type HistoryPembayaranKomisiTableData = z.infer<typeof HistoryPembayaranKomisiTableDataSchema>;
