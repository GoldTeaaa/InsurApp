'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { flexRender, getCoreRowModel, useReactTable, TableMeta } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { columns } from "@/features/pembayaran/pembayaranPremi/columns";
import { PembayaranTableRow } from '@/lib/pembayaran/pembayaran_premi/types';
import PremiHistoryDialog from "./premiHistory/PremiHistoryDialog";
import AddPremiDialog from "./PremiFormDialog";

export default function PembayaranTable({ data }: { data: PembayaranTableRow[] }) {
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [AddPembayaranPremiToId, setPembayaranPremiToId] = useState<string | null>(null);
    const router = useRouter();

    const handleRowClick = (id: string) => {
        setSelectedRowId(id);
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            onRowClick: handleRowClick,
        }
    })

    const handleOpenAddDialog = () => {
        if (selectedRowId) {
            setPembayaranPremiToId(selectedRowId);
            setSelectedRowId(null);
        }
    };

    const handleOnSuccess = (id: string) => {
        router.refresh();
        setPembayaranPremiToId(null);
        setSelectedRowId(id);
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
                    onEditSuccess={() => router.refresh()}
                    data={data.filter((row) => row.id === selectedRowId)}
                />
            )}

            {AddPembayaranPremiToId && (
                <AddPremiDialog
                    id={AddPembayaranPremiToId}
                    isOpen={!!AddPembayaranPremiToId}
                    onOpenChange={(isOpen) => !isOpen && setPembayaranPremiToId(null)}
                    onSuccess={() => handleOnSuccess(AddPembayaranPremiToId)}
                />
            )}
        </>
    );
}