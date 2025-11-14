import z from "zod";
import { CARA_BAYAR } from "@/lib/types";

export const PembayaranKomisiFormSchema = z.object({
  tanggal_bayar: z.coerce.date(
    {
      required_error: "Tanggal bayar wajib diisi",
    }
  ),
  cara_bayar: z.enum(CARA_BAYAR),
  amount_paid: z.coerce.number().min(1, "Jumlah pembayaran wajib lebih dari 0"),
  no_kwitansi: z.string().min(1, "No Kwitansi wajib diisi"),
  rekening_bank: z.string().nullable().optional(),
})

export const PayloadPembayaranKomisiFormSchema = PembayaranKomisiFormSchema.extend({
  detail_komisi_id: z.string().uuid()
})

export const UpdatePembayaranKomisiFormSchema = PembayaranKomisiFormSchema.extend({
  pembayaran_komisi_id: z.string().uuid(),
})

export type UpdatePembayaranKomisiForm = z.infer<typeof UpdatePembayaranKomisiFormSchema>;
export type PayloadPembayaranKomisiForm = z.infer<typeof PayloadPembayaranKomisiFormSchema>;
export type PembayaranKomisiInputForm = z.infer<typeof PembayaranKomisiFormSchema>;

export const defaultValuePembayaranKomisiForm: PembayaranKomisiInputForm = {
  amount_paid: 0,
  tanggal_bayar: new Date(),
  cara_bayar: CARA_BAYAR[0],
  no_kwitansi: "",
  rekening_bank: null,
}

// =============== HISTORY PEMBAYARAN TABLE SECTION ================

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
  cara_bayar: z.enum(CARA_BAYAR),
  tanggal_bayar: z.coerce.date(),
  rekening_bank: z.string().nullable().optional(),
  no_kwitansi: z.string(),
});

export const HistoryPembayaranKomisiTableDataSchema = z.array(
  HistoryPembayaranKomisiTableRowSchema
);

export type HistoryPembayaranKomisiTableRow = z.infer<typeof HistoryPembayaranKomisiTableRowSchema>;
export type HistoryPembayaranKomisiTableData = z.infer<typeof HistoryPembayaranKomisiTableDataSchema>;
