'use client';
import { PelunasanPremiRow } from "@/lib/laporan/laporan-pelunasan-premi/types";
import { formatDateRange } from "@/lib/utils/formatDate";
import { getStatusClass } from "@/lib/utils/getStatusBadge";
import { ColumnDef } from "@tanstack/react-table";

export const columnLapPelunasanPremi: ColumnDef<PelunasanPremiRow>[] = [
    {
        accessorKey: 'nomor_polis',
        header: 'No. Polis',
    },
    {
        accessorKey: 'nama_tertanggung',
        header: 'Nama Tertanggung',
    },
    {
        accessorKey: 'bisnis',
        header: 'Jenis Bisnis',
    },
    {
        id: 'periode_polis',
        header: 'Periode Polis',
        cell: ({ row }) => {
            const { periode_mulai, periode_akhir } = row.original;
            return formatDateRange(periode_mulai, periode_akhir);
        },
    },
    {
        accessorKey: 'premi_gross',
        header: 'Premi Gross',
        cell: info => info.getValue<number>()?.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }) ?? null,
        meta: { className: 'text-right' }
    },
    {
        accessorKey: 'discount',
        header: 'Discount',
        cell: info => info.getValue<number>()?.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }) ?? null,
        meta: { className: 'text-right' }
    },
    {
        accessorKey: 'biaya_admin_materai',
        header: 'Biaya Admin/Materai',
        cell: info => info.getValue<number>()?.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }) ?? null,
        meta: { className: 'text-right' }
    },
    {
        accessorKey: 'premi_net',
        header: 'Premi Net',
        cell: info => info.getValue<number>()?.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }) ?? null,
        meta: { className: 'text-right' }
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
        accessorKey: 'amount_paid',
        header: 'Jumlah Dibayar',
        cell: info => info.getValue<number>()?.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }) ?? null,
        meta: { className: 'text-right' }
    },
    {
        accessorKey: 'tanggal_bayar',
        header: 'Tanggal Bayar',
        cell: ({ row }) => row.original.tanggal_bayar ? new Date(row.original.tanggal_bayar).toLocaleDateString('id-ID') : '-',
    },
    {
        accessorKey: 'amount_due',
        header: 'Sisa Tagihan',
        cell: ({ row }) => {
            const amount_due = row.original.premi_net - row.original.amount_paid;
            return amount_due.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            });
        },
        meta: { className: 'text-right' }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
            const status = getValue<string>();

            return <span className={getStatusClass(status)}>{status.replace('_', ' ')}</span>;
        },
    }
];