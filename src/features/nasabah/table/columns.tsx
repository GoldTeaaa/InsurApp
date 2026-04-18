"use client";
import { ColumnDef } from "@tanstack/react-table";

import { NasabahTableRow } from "@/lib/nasabah/tableType";
import { formatDate } from "@/lib/utils/formatDate";
import TableAction from "@/components/table/TableAction";
import { TableMetaAction } from "@/lib/perusahaan_asuransi/types/tableActionType";

export const columnNasabah: ColumnDef<NasabahTableRow>[] = [
  {
    accessorKey: "nama",
    header: "Nama",
    cell: ({ row, table }) => {
      const { handleEdit } = table.options.meta as TableMetaAction;
      const { nasabah_id, created_at } = row.original;

      return (
        <button
          onClick={() => handleEdit(nasabah_id)}
          className="flex flex-col items-start text-left hover:underline decoration-current/20"
        >
          <span className="font-medium">{row.original.nama}</span>
          <span className="text-xs text-gray-500 font-normal">Terdaftar Sejak {formatDate(created_at)}</span>
        </button>
      )
    }
  },
  {
    accessorKey: "tipe",
    header: "Tipe",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contact_1",
    header: "Kontak 1",
  },
  {
    accessorKey: "contact_2",
    header: "Kontak 2",
  },
  {
    accessorKey: "alamat",
    header: "Alamat",
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.original.alamat ?? "—"}</div>
    ),
  },
  {
    accessorKey: "jumlah_polis_total",
    header: "Jumlah Polis Total",
  },
  {
    accessorKey: "jumlah_polis_aktif",
    header: "Jumlah Polis Aktif"
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row, table }) => {
      const { handleEdit, handleDelete } = table.options.meta as TableMetaAction;
      const { nasabah_id, nama } = row.original;
      return (
        <TableAction
          id={nasabah_id}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          item={nama}
        />
      );
    },
  },
];