'use client';
import { LaporanAgingKomisiItem } from "@/lib/laporan/laporan-aging-komisi/types";
import { AGING_RANGE } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

const agingBucketColumns: ColumnDef<LaporanAgingKomisiItem>[] = AGING_RANGE.map((range) => ({
    id: range,
    header: range,
    cell: ({row}) => {
        if(row.original.aging_bracket === range){
            return row.original.amount_due.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            })
        }
        return "-";
    }
}))

export const columnLapAgingKomisi: ColumnDef<LaporanAgingKomisiItem>[] = [
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
        cell: ({ row }) => {
            const { periode_mulai, periode_akhir } = row.original;
            if (!periode_mulai || !periode_akhir) return null;
            return `${new Date(periode_mulai).toLocaleDateString('id-ID')} - ${new Date(periode_akhir).toLocaleDateString('id-ID')}`;
        },
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
    {
        accessorKey: 'komisi_gross',
        header: 'Komisi Gross',
        cell: info => info.getValue<number>()?.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }) ?? null,
        meta: {
            className: 'text-right'
        }
    },
    {
        accessorKey: 'pph',
        header: 'PPH',
        cell: info => info.getValue<number>()?.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }) ?? null,
        meta: {
            className: 'text-right'
        }
    },
    {
        accessorKey: 'komisi_net',
        header: 'Komisi Net',
        cell: info => info.getValue<number>()?.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }) ?? null,
        meta: {
            className: 'text-right'
        }
    },
    // {
    //     accessorKey: 'detail_komisi_status',
    //     header: 'Status',
    // },
    ...agingBucketColumns
];