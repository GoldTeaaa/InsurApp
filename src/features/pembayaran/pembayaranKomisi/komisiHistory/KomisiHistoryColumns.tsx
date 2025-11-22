import { ColumnDef } from "@tanstack/react-table";
import { HistoryPembayaranKomisiTableRow } from "@/lib/pembayaran/pembayaran_komisi/types";
import PembayaranKomisiDropdown from "@/features/pembayaran/pembayaranKomisi/komisiHistory/PembayaranKomisiDropdown";
import { convertIDR } from "@/lib/utils/convertIDR";
import convertDate from "@/lib/utils/convertDate";

type onEditPembayaranClick = {
    onEditPembayaranClick: (id: string) => void,
    onDeletePembayaranClick: (id: string) => void
}

export const komisiHistoryColumns: ColumnDef<HistoryPembayaranKomisiTableRow>[] = [
    {
        accessorKey: "nomor_polis",
        header: "Nomor Polis",
    },
    {
        accessorKey: "amount_paid",
        header: "Jumlah Bayar",
        cell: ({ getValue }) => {
            const amount = getValue<number>();
            return convertIDR(amount);
        }
    },
    {
        accessorKey: "tanggal_bayar",
        header: "Tanggal Bayar",
        cell: ({ getValue }) => {
            const dateString = getValue<string>();
            return convertDate(dateString);
        }
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
            const { 
                onEditPembayaranClick,
                onDeletePembayaranClick
            } = table.options.meta as onEditPembayaranClick;
            return (
                <PembayaranKomisiDropdown
                    pembayaranKomisiId={pembayaranKomisiId}
                    openDetail={onEditPembayaranClick}
                    deletePembayaran={onDeletePembayaranClick}
                />
            )
        }
    }
]