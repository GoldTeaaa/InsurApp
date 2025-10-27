'use client';
import { useState } from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { columns } from "@/features/pembayaran/columns";
import { PembayaranTableRow } from '@/lib/pembayaran/pembayaran_premi/types';
import PremiHistoryDialog from "./premiHistory/PremiHistoryDialog";
import AddPremiDialog from "./AddPremiDialog";

export default function PembayaranTable({ data }: { data: PembayaranTableRow[] }) {
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [AddPembayaranPremiToId, setPembayaranPremiToId] = useState<string | null>(null);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const handleOpenAddDialog = () => {
        if (selectedRowId) {
            setPembayaranPremiToId(selectedRowId);
            setSelectedRowId(null);
        }
    };

    return (
        <>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder ?
                                        null :
                                        flexRender(header.column.columnDef.header, header.getContext())
                                    }
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map(row => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                onClick={() => setSelectedRowId(row.original.id)}
                                className="cursor-pointer"
                            >
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {selectedRowId && (
                <PremiHistoryDialog
                    id={selectedRowId}
                    isOpen={!!selectedRowId}
                    onOpenChange={(isOpen) => !isOpen && setSelectedRowId(null)}
                    onAddNew={handleOpenAddDialog}
                />
            )}

            {AddPembayaranPremiToId && (
                <AddPremiDialog
                    id={AddPembayaranPremiToId}
                    isOpen={AddPembayaranPremiToId ? true : false}
                    onOpenChange={(isOpen) => !isOpen && setPembayaranPremiToId(null)}
                />
            )}
        </>
    );
}