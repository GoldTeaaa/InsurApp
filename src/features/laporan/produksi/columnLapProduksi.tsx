import { ColumnDef } from "@tanstack/react-table";
import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatIDR } from "@/lib/utils/formatCurrency";

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
        cell: ({ row }) => {
                const { periode_mulai, periode_akhir } = row.original;
                if(!periode_mulai || !periode_akhir) return '-';
                const options: Intl.DateTimeFormatOptions = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                };
                const startDate = new Date(periode_mulai).toLocaleDateString("id-ID", options);
                const endDate = new Date(periode_akhir).toLocaleDateString("id-ID", options);
                return `${startDate} - ${endDate}`;
            },
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

export const columnLapProduksi: ColumnDef<LaporanProduksiRow>[] = [
    {
        accessorKey: 'nomor_polis',
        header: 'No. Polis',
        cell: ({ row, table, getValue }) => {
            const previousRow = table.getRowModel().rows[row.index - 1];
            if (previousRow && previousRow.original.nomor_polis === row.original.nomor_polis) {
                return null;
            }
            return <strong className="font-semibold">{getValue<string>()}</strong>;
        },
    },
    {
        accessorKey: 'nama_tertanggung',
        header: 'Nama Tertanggung',
        cell: ({ row, table, getValue }) => {
            const previousRow = table.getRowModel().rows[row.index - 1];
            if (previousRow && previousRow.original.nomor_polis === row.original.nomor_polis) {
                return null;
            }
            return <strong className="font-semibold">{getValue<string>()}</strong>;
        },
    },
    {
        id: 'periode',
        header: 'Periode',
        cell: ({ row, table }) => {
            const previousRow = table.getRowModel().rows[row.index - 1];
            if (previousRow && previousRow.original.nomor_polis === row.original.nomor_polis) {
                return null;
            }

            const { periode_mulai, periode_akhir } = row.original;
            if (!periode_mulai || !periode_akhir) return '-';
            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            };
            const startDate = new Date(periode_mulai).toLocaleDateString("id-ID", options);
            const endDate = new Date(periode_akhir).toLocaleDateString("id-ID", options);
            return <strong className="font-semibold">{`${startDate} - ${endDate}`}</strong>;
        },
        sortingFn: (rowA, rowB) => new Date(rowA.original.periode_mulai).getTime() - new Date(rowB.original.periode_mulai).getTime(),
    },
    {
        accessorKey: 'jenis_bisnis',
        header: 'Jenis Bisnis',
        cell: ({ row, table, getValue }) => {
            const previousRow = table.getRowModel().rows[row.index - 1];
            if (previousRow && previousRow.original.nomor_polis === row.original.nomor_polis) {
                return null;
            }
            return <strong className="font-semibold">{getValue<string>()}</strong>;
        },
    },
    {
        accessorKey: 'nama_perusahaan_asuransi',
        header: 'Perusahaan Asuransi',
    },
    {
        accessorKey: 'premi',
        header: 'Premi',
        cell: info => formatIDR(info.getValue<number>()),
    },
    {
        accessorKey: 'discount',
        header: 'Discount',
        cell: info => formatIDR(info.getValue<number>()),
    },
    {
        accessorKey: 'biaya_admin_materai',
        header: 'Biaya Admin/Materai',
        cell: info => formatIDR(info.getValue<number>()),
    },
    {
        accessorKey: 'premi_net',
        header: 'Premi Net',
        cell: info => formatIDR(info.getValue<number>()),
    },
    {
        accessorKey: 'no_kwitansi_komisi',
        header: 'No. Kwitansi Komisi',
    },
    {
        accessorKey: 'komisi',
        header: 'Komisi',
        cell: info => formatIDR(info.getValue<number>()),
    },
    {
        accessorKey: 'pph_komisi',
        header: 'PPH Komisi',
        cell: info => formatIDR(info.getValue<number>()),
    },
    {
        accessorKey: 'komisi_net',
        header: 'Komisi Net',
        cell: info => formatIDR(info.getValue<number>()),
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
            return share != null ? `${share}%` : '';
        }
    },
]