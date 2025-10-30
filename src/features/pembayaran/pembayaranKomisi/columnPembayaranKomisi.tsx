import { komisiTableRowData } from "@/lib/pembayaran/pembayaran_komisi/types";
import { ColumnDef } from "@tanstack/react-table";
import PembayaranKomisiDropdown from "./PembayaranKomisiDropdown";

export const komisiColumnAttributes: ColumnDef<komisiTableRowData>[] = [
    {
        accessorKey: 'nomor_polis',
        header: 'Nomor Polis',
    },
    {
        accessorKey: 'nama_nasabah',
        header: 'Nama Nasabah',
    },
    {
        accessorKey: 'nama_perusahaan',
        header: 'Perusahaan',
    },
    {
        accessorKey: 'created_at',
        header: 'Tanggal Input',
    },
    {
        accessorKey: 'komisi_net',
        header: 'Komisi Net',
    },
    {
        accessorKey: 'total_paid',
        header: 'Total Pembayaran',
    },
    {
        accessorKey: 'sisa_komisi',
        header: 'Sisa Komisi',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const rowId = row.original.polis_share_id;
            return (
                <PembayaranKomisiDropdown
                    pembayaranKomisiId={rowId}
                />
            )
        }
    }
]
