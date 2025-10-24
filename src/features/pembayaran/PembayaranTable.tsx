'use client';
import getPembayaranTableData from "@/features/pembayaran/actions/getPembayaranTable";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { columns } from "@/features/pembayaran/columns";
import { PembayaranPremiProps, PembayaranTableRow } from '@/lib/pembayaran/pembayaran_premi/types';

export default function PembayaranTable({
    search,
    page,
    size,
    status
}: PembayaranPremiProps) {
    const [data, setData] = useState<PembayaranTableRow[]>([]);

    useEffect(() => {
        async function fetchData() {
            const result = await getPembayaranTableData({ search, page, size, status })
            if (result.success && result.data) {
                setData(result.data)
            } else {
                console.error(result.message)
                setData([])
            }
        }
        fetchData()
    }, [search, page, size, status])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    console.log('STATUS', status)

    return (
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
    );
}