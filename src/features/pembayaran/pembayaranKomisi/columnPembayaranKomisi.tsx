import { komisiTableRowData } from "@/lib/pembayaran/pembayaran_komisi/types";
import { ColumnDef } from "@tanstack/react-table";
import PembayaranKomisiDropdown from "./PembayaranKomisiDropdown";
import { getStatusClass } from "@/lib/utils/getStatusBadge";
import convertDate from "@/lib/utils/convertDate";
import { convertIDR } from "@/lib/utils/convertIDR";

type onClick = {
    onRowClick: (id: string) => void
}

export const komisiColumnAttributes: ColumnDef<komisiTableRowData>[] = [
    {
        accessorKey: 'nomor_polis',
        header: 'Nomor Polis',
        cell: ({ row, table }) => {
            const komisiRowId = row.original.polis_share_id;
            const nomorPolis = row.original.nomor_polis;
            const { onRowClick } = table.options.meta as onClick;

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
        cell: ({ getValue }) => {
            const dateString = getValue<string>();
            return convertDate(dateString);
        }
    },
    {
        accessorKey: 'komisi_net',
        header: 'Komisi Net',
        cell: ({ getValue }) => {
            const amount = getValue<number>();
            return convertIDR(amount);
        }
    },
    {
        accessorKey: 'total_paid',
        header: 'Total Pembayaran',
        cell: ({ getValue }) => {
            const amount = getValue<number>();
            return convertIDR(amount);
        }
    },
    {
        accessorKey: 'sisa_komisi',
        header: 'Sisa Komisi',
        cell: ({ getValue }) => {
            const amount = getValue<number>();
            return convertIDR(amount);
        }
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
        cell: ({ row, table }) => {
            const rowId = row.original.polis_share_id;
            const { onRowClick } = table.options.meta as onClick;
            return (
                <PembayaranKomisiDropdown
                    pembayaranKomisiId={rowId}
                    openDetail={onRowClick}
                />
            )
        }
    }
]
