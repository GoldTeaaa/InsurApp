'use client';
import { DefaultTableNasabahDetailType } from "@/lib/nasabah/nasabah-card/default-table-type";
import { formatDateRange } from "@/lib/utils/formatDate";
import { ColumnDef } from "@tanstack/react-table";

export const defaultDetailPolisNasabahColumn: ColumnDef<DefaultTableNasabahDetailType>[] =
  [
    {
      accessorKey: "nama",
      header: "Nama Nasabah",
    },
    {
      accessorKey: "nomor_polis",
      header: "Nomor Polis",
    },
    {
      accessorKey: "jenis_coas",
      header: "Jenis Coas",
    },
    {
      accessorKey: "bisnis",
      header: "Bisnis",
    },
    {
      accessorKey: "periode_mulai",
      header: "Periode",
      cell: ({ row }) => {
        const { periode_mulai, periode_akhir } = row.original;
        return formatDateRange(periode_mulai, periode_akhir);
      }
    },
    {
      accessorKey: "total_premi",
      header: "Total Premi",
    },
  ];
