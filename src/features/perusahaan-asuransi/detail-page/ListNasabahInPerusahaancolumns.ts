'use client';
import { NasabahInPerusahaanTableCardType } from "@/lib/perusahaan_asuransi/types/perusahaan-card-data";
import { ColumnDef } from "@tanstack/react-table";

export const listNasabahInPerusahaanColumns: ColumnDef<NasabahInPerusahaanTableCardType>[] = [
    {
        accessorKey: "nama_nasabah",
        header: "Nama Nasabah",
    },
    {
        accessorKey: "jenis_coas",
        header: "Jenis Coas",
        cell: ({ row }) => {
            const val = row.getValue("jenis_coas") as string;
            return val === "coas" ? "Co-Insurance" : "Non Co-Insurance";
        }
    },
    {
        accessorKey: "persentase_share",
        header: "Share",
        cell: ({ row }) => {
            const val = row.getValue("persentase_share") as number;
            return `${val}%`;
        }
    },
    {
        accessorKey: "total_premi",
        header: "Total Premi",
        cell: ({ row }) => {
            const amount = row.getValue("total_premi") as number;
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(amount);
        },
    },
    {
        accessorKey: "periode_akhir",
        header: "Periode Akhir",
        cell: ({ row }) => {
            const date = row.getValue("periode_akhir") as Date;
            return date ? new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";
        },
    },
]