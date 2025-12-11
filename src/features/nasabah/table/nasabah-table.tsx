"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { UpdateInvoice, DeleteNasabah } from "../buttons";
import { columnNasabah } from "./columns";
import { NasabahTableRow } from "@/lib/nasabah/tableType";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils/formatDate";
import { deleteNasabahAction } from "../actions/deleteNasabah";
import { useActionState } from "react";
import { toast } from "sonner";

export default function NasabahTable({
  data
}: { data: NasabahTableRow[] }) {
  const router = useRouter();
  
  const handleEdit = (id: string) => {
    router.push(`/dashboard/nasabah/${id}/edit`);
  }

  const handleDelete = async (id: string) => {
    try{
      const result = await deleteNasabahAction(id);
      if(result.success){
        router.refresh();
        toast.success(result.message);
      }
    }catch(e){
      console.error(e);
    }
  }

  const table = useReactTable({
    data,
    columns: columnNasabah,
    getCoreRowModel: getCoreRowModel(),
    meta:{
      handleEdit,
      handleDelete
    }
  });

  if (data.length === 0) {
    return (
      <div className="mt-6 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
        Tidak ada data nasabah.
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile cards */}
          <div className="md:hidden">
            {table.getRowModel().rows.map((row) => (
              <div key={row.id} className="mb-2 w-full rounded-md bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{row.original.nama ?? "—"}</p>
                    <p className="text-xs text-gray-500">{row.original.tipe}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>{row.original.email ?? "—"}</p>
                    <p>{row.original.contact_1 ?? "—"}</p>
                  </div>
                </div>
                <div className="pt-3 text-sm text-gray-700">
                  <p className="line-clamp-2">{row.original.alamat ?? ""}</p>
                  <p className="mt-2 text-xs text-gray-400">Dibuat: {formatDate(row.original.created_at)}</p>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <UpdateInvoice id={row.original.id} />
                  <DeleteNasabah id={row.original.id} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="min-w-full text-gray-900">
              <thead className="text-left text-sm font-normal text-gray-500">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-3 py-4 font-medium first:pl-6 last:pr-6">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white text-sm">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors"
                    // onClick={() => rowDetail(row.original.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="whitespace-nowrap px-3 py-4 first:pl-6 last:pr-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}