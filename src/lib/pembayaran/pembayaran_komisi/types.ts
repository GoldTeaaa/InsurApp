import z from "zod";

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
}

export type komisiTableData = {
    rows: komisiTableRowData[];
    total_row_count: number;
}

export const HistoryPembayaranKomisiTableDataSchema = z.object({
    nomor_polis: z.string(),
    pembayaran_komisi_id: z.string(),
    detail_komisi_id: z.string(),
    amount_paid: z.number(),
    tanggal_bayar: z.coerce.date(),
    rekening_bank: z.string(),
    no_kwitansi: z.string()
})

export type HistoryPembayaranKomisiTableData = {
    nomor_polis: string,
    pembayaran_komisi_id: string,
    detail_komisi_id: string,
    amount_paid: number,
    tanggal_bayar: Date,
    rekening_bank: string,
    no_kwitansi: string
}