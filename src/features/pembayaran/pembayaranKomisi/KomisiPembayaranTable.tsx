'use client';
import { komisiTableRowData } from "@/lib/pembayaran/pembayaran_komisi/types";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { komisiColumnAttributes } from "./columnPembayaranKomisi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table"; 
import { useState } from "react";
import KomisiHistoryDialog from "./komisiHistory/KomisiHistoryDialog";

export default function KomisiPembayaranTable({ data }: { data: komisiTableRowData[] }) {
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const table = useReactTable({
        data,
        columns: komisiColumnAttributes,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            onRowClick: (id: string) => {
                setSelectedRowId(id);
            }
        }
    })

    return (
        <div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() ? "selected" : ""}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {selectedRowId && (
                <KomisiHistoryDialog
                    detailKomisiId={selectedRowId}
                    isOpen={!!selectedRowId}
                    onOpenChange={(isOpen) => {
                        if(!isOpen) setSelectedRowId(null)
                    }}
                />
            )}
        </div>
    );
}