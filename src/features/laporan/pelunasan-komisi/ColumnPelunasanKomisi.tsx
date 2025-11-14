'use client';
import { LaporanPelunasanKomisiRow } from "@/lib/laporan/laporan-pelunasan-komisi/types";
import { formatDateRange } from "@/lib/utils/formatDate";
import { formatCurrencyIDR } from "@/lib/utils/formatCurrencyIDR";
import { getStatusClass } from "@/lib/utils/getStatusBadge";
import { ColumnDef } from "@tanstack/react-table";

export const columnLapPelunasanKomisi: ColumnDef<LaporanPelunasanKomisiRow>[] =
    [
        { accessorKey: "nomor_polis", header: "Nomor Polis" },
        { accessorKey: "nama_tertanggung", header: "Nama Tertanggung" },
        { accessorKey: "bisnis", header: "Bisnis" },
        {
            accessorKey: "periode",
            header: "Periode Polis",
            cell: ({ row }) => {
            const { periode_mulai, periode_akhir } = row.original;
            return formatDateRange(periode_mulai, periode_akhir);
        },
        },
        {
            accessorKey: "no_kwitansi",
            header: "Nomor Kwitansi"
        },
        // {
        //     accessorKey: "komisi_gross",
        //     header: "Komisi Gross",
        //     cell: ({ getValue }) => {
        //         const value = getValue<number>();
        //         return value ? formatCurrencyIDR(value) : "-";
        //     },
        // },
        // {
        //     accessorKey: "pph_komisi",
        //     header: "PPH",
        //     cell: ({ getValue }) => {
        //         const value = getValue<number>();
        //         return value ? formatCurrencyIDR(value) : "-";
        //     },
        // },
        {
            accessorKey: "komisi_net",
            header: "Komisi Net",
            cell: ({ getValue }) => {
                const value = getValue<number>();
                return value ? formatCurrencyIDR(value) : "-";
            },
        },
        { accessorKey: "nama_perusahaan_asuransi", header: "Asuransi" },
        { accessorKey: "jenis_coas", header: "Jenis COAS" },
        { accessorKey: "share", header: "Share (%)" },
        {
            accessorKey: "amount_paid",
            header: "Amount Paid",
            cell: ({ getValue }) => {
                const value = getValue<number>();
                return value ? formatCurrencyIDR(value) : "-";
            },
        },
        {
            accessorKey: "amount_due",
            header: "Amount Due",
            cell: ({ row }) => {
                const amount_due = row.original.komisi_net - row.original.amount_paid;
                return amount_due ? formatCurrencyIDR(amount_due) : "-";
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({getValue}) => {
                const value = getValue<string>();
                return <span className={getStatusClass(value)}>
                    {value.replace('_', ' ')}
                </span>;
            }
        },
    ];