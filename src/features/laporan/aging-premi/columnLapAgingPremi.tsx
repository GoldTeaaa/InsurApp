"use client";
import { LaporanAgingPremiRow } from "@/lib/laporan/laporan-aging-premi/types";
import { ColumnDef } from "@tanstack/react-table";
import { AGING_RANGE } from "@/lib/laporan/laporan-aging-premi/types";

// Dynamically create a column for each aging bucket
const agingBucketColumns: ColumnDef<LaporanAgingPremiRow>[] = AGING_RANGE.map((range) => ({
    id: range,
    header: range,
    cell: ({ row }) => {
        if (row.original.aging_bracket === range) {
            return row.original.amount_due?.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }) ?? null;
        }
        return "-";
    },
    meta: {
        className: 'text-right'
    }
}));

export const columnLapAgingPremi: ColumnDef<LaporanAgingPremiRow>[] = [
    {
        accessorKey: 'nomor_polis',
        header: 'No. Polis',
    },
    {
        accessorKey: 'nama_tertanggung',
        header: 'Nama Tertanggung',
    },
    {
        accessorKey: 'jenis_bisnis',
        header: 'Jenis Bisnis',
    },
    {
        id: 'periode_polis',
        header: 'Periode Polis',
        cell: ({ row }) => `${row.original.periode_mulai.toLocaleDateString()} - ${row.original.periode_akhir.toLocaleDateString()}`,
        sortingFn: (rowA, rowB) => rowA.original.periode_mulai.getTime() - rowB.original.periode_mulai.getTime(),
    },
    {
        accessorKey: 'premi_net',
        header: 'Premi Net',
        cell: info => info.getValue<number>().toLocaleString(),
    },
    {
        accessorKey: 'amount_paid',
        header: 'Jumlah Sudah Bayar',
        cell: info => info.getValue<number>().toLocaleString(),
    },
    {
        accessorKey: 'nama_perusahaan_asuransi',
        header: 'Perusahaan Asuransi',
    },
    {
        accessorKey: 'jenis_coas',
        header: 'Jenis COAS',
    },
    {
        accessorKey: 'share',
        header: 'Share',
        cell: ({ row }) => (row.original.share ? `${row.original.share}%` : null),
    },
    ...agingBucketColumns,
];