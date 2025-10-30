import { ColumnDef } from "@tanstack/react-table";
import { HistoryPembayaranKomisiTableRow } from "@/lib/pembayaran/pembayaran_komisi/types";
import PembayaranKomisiDropdown from "@/features/pembayaran/pembayaranKomisi/komisiHistory/PembayaranKomisiDropdown";

export const komisiHistoryColumns: ColumnDef<HistoryPembayaranKomisiTableRow>[] = [
    {
        accessorKey: "nomor_polis",
        header: "Nomor Polis",
    },
    {
        accessorKey: "amount_paid",
        header: "Jumlah Bayar",
    },
    {
        accessorKey: "tanggal_bayar",
        header: "Tanggal Bayar",
    },
    {
        accessorKey: "cara_bayar",
        header: "Cara Bayar",
    },
    {
        accessorKey: "no_kwitansi",
        header: "No Kwitansi",
    },
    {
        accessorKey: "rekening_bank",
        header: "Rekening Bank",
    },
    {
        id: 'actions',
        cell: ({ row, table }) => {
            const pembayaranKomisiId = row.original.pembayaran_komisi_id
            return (
                <PembayaranKomisiDropdown 
                    pembayaranKomisiId={pembayaranKomisiId}
                />
            )
        }
    }
]