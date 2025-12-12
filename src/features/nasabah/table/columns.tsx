"use client";
import { ColumnDef } from "@tanstack/react-table";
import { UpdateInvoice } from "../buttons";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteNasabahAction } from "@/features/nasabah/actions/deleteNasabah";
import { NasabahTableRow } from "@/lib/nasabah/tableType";
import { formatDate } from "@/lib/utils/formatDate";
import TableAction from "@/components/TableAction";
import { table } from "console";
import { TableMetaAction } from "@/lib/perusahaan_asuransi/types/tableActionType";

export const columnNasabah: ColumnDef<NasabahTableRow>[] = [
  {
    accessorKey: "nama",
    header: "Nama",
    cell: ({row, table}) => {
      const {handleEdit} = table.options.meta as TableMetaAction;
      const {id} = row.original;

      return(
        <button
          onClick={() => handleEdit(id)}
          className="text-left underline underline-offset-10 decoration-current/20 hover:underline"
        >
          {row.original.nama}
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
    accessorKey: "created_at",
    header: "Dibuat",
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  {
    accessorKey: "updated_at",
    header: "Diubah",
    cell: ({ row }) => formatDate(row.original.updated_at),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row, table }) => {
      const { handleEdit, handleDelete } = table.options.meta as TableMetaAction;
      const { id, nama  } = row.original;
      return (
        <TableAction 
          id={id}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          item={nama}
        />
      );
    },
  },
];