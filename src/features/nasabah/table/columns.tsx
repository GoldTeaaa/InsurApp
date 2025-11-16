"use client";
import { ColumnDef } from "@tanstack/react-table";
import { UpdateInvoice } from "../buttons";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteNasabahAction } from "@/features/nasabah/actions/deleteNasabah";
import { NasabahTableRow } from "@/lib/nasabah/tableType";

function fmt(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export const columnNasabah: ColumnDef<NasabahTableRow>[] = [
  {
    accessorKey: "nama",
    header: "Nama",
    cell: ({row, table}) => {
      const {rowDetail} = table.options.meta as {rowDetail: (id: string) => void}

      return(
        <button
          onClick={() => rowDetail(row.original.id)}
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
    cell: ({ row }) => fmt(row.original.created_at),
  },
  {
    accessorKey: "updated_at",
    header: "Diubah",
    cell: ({ row }) => fmt(row.original.updated_at),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div className="flex justify-end gap-3">
          <UpdateInvoice id={id} />
          <DeleteButton
            id={id}
            action={deleteNasabahAction}
            entityName="nasabah"
          />
        </div>
      );
    },
  },
];