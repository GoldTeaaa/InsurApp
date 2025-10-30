import { komisiTableRowData } from "@/lib/pembayaran/pembayaran_komisi/types";
import { ColumnDef } from "@tanstack/react-table";
import PembayaranKomisiDropdown from "./PembayaranKomisiDropdown";
import { getStatusClass } from "@/lib/utils/getStatusBadge";

export const komisiColumnAttributes: ColumnDef<komisiTableRowData>[] = [
    {
        accessorKey: 'nomor_polis',
        header: 'Nomor Polis',
        cell: ({ row, table }) => {
            const komisiRowId = row.original.polis_share_id;
            const nomorPolis = row.original.nomor_polis;
            const { onRowClick } = table.options.meta as { onRowClick: (id: string) => void };

            return (
                <button
                    className="text-left"
                    onClick={() => onRowClick(komisiRowId)}
                >
                    {nomorPolis}
                </button>
            );
        }
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
        cell: ({ getValue }) => {
            const status = getValue<string>();
            return <span className={getStatusClass(status)}>{status.replace('_', ' ')}</span>;
        },
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
