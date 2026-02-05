"use client";
import { NasabahInPerusahaanTableCardType } from "@/lib/perusahaan_asuransi/types/perusahaan-card-data";
import { formatCurrencyIDR } from "@/lib/utils/formatCurrencyIDR";
import { formatDate } from "@/lib/utils/formatDate";
import { ColumnDef } from "@tanstack/react-table";

const status = (tanggal: Date): string => {
  const periode_akhir = new Date(tanggal);
  const today = new Date();

  if (periode_akhir > today) {
    return "Aktif";
  } else {
    return "Tidak Aktif";
  }
};

export const listNasabahInPerusahaanColumns: ColumnDef<NasabahInPerusahaanTableCardType>[] =
  [
    {
      accessorKey: "nama_nasabah",
      header: "Nama Nasabah",
    },
    {
      accessorKey: "jenis_coas",
      header: "Jenis Coas",
      cell: ({ row }) => {
        const val = row.getValue("jenis_coas") as string;
        return val;
      },
    },
    {
      accessorKey: "persentase_share",
      header: "Share",
      cell: ({ row }) => {
        const val = row.getValue("persentase_share") as number;
        return `${val}%`;
      },
    },
    {
      accessorKey: "total_premi",
      header: "Total Premi",
      cell: ({ row }) => {
        const amount = row.getValue("total_premi") as number;
        return formatCurrencyIDR(amount);
      },
    },
    {
      accessorKey: "periode_akhir",
      header: "Periode Akhir",
      cell: ({ row }) => {
        const date = row.getValue("periode_akhir") as Date;
        if (!date) return "-";

        const statusText = status(date);
        const isActive = statusText === "Aktif";

        return (
          <div className="flex flex-col items-start gap-1">
            <span className="font-medium">{formatDate(date)}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {statusText}
            </span>
          </div>
        );
      },
    }
  ];
