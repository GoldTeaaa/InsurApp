import { ColumnDef } from "@tanstack/react-table";
import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import { ChevronDown, ChevronRight } from "lucide-react";

export const columnLaporanProduksi: ColumnDef<LaporanProduksiRow>[] = [
    {
        accessorKey: 'expand',
        header: () => null,
        cell: ({ row }) => {
            return row.getCanExpand() ? (
                <button
                    {...{
                        // onClick: row.getToggleExpandedHandler(),
                        style: { cursor: 'pointer' },
                    }}
                    className="p-1 rounded-full hover:bg-gray-100"
                >
                    {row.getIsExpanded()
                        ? <ChevronDown className="h-4 w-4" />
                        : <ChevronRight className="h-4 w-4" />
                    }
                </button>
            ) : (
                '🔵'
            )
        }
    },
    {
        accessorKey: 'nomor_polis',
        header: 'No. Polis',
    },
    {
        accessorKey: 'nama_tertanggung',
        header: 'Nama Tertanggung',
    },
    {
        accessorKey: 'nama_perusahaan_asuransi',
        header: 'Perusahaan Asuransi',
    },
    {
        accessorKey: 'jenis_bisnis',
        header: 'Jenis Bisnis',
    },
    {
        accessorKey: 'premi_net',
        header: 'Premi Net',
        cell: info => info.getValue<number>().toLocaleString(),
    },
    {
        accessorKey: 'komisi_net',
        header: 'Komisi Net',
        cell: info => info.getValue<number>().toLocaleString(),
    },
    {
        id: 'periode', // Use a unique ID for columns that don't have a single accessorKey
        header: 'Periode',
        cell: ({ row }) =>
            `${row.original.periode_mulai.toLocaleDateString()} - ${row.original.periode_akhir.toLocaleDateString()}`,
        // Optional: Define how sorting should work for this column
        // This will sort by the start date when the user clicks the header.
        sortingFn: (rowA, rowB) => rowA.original.periode_mulai.getTime() - rowB.original.periode_mulai.getTime(),
    },
    {
        accessorKey: 'jenis_coas',
        header: 'Jenis COAS',
    },
    {
        accessorKey: 'share',
        header: 'Share',
        cell: ({ row }) => {
            const share = row.original.share;
            return share ? `${share}%` : '';
        }
    },
]