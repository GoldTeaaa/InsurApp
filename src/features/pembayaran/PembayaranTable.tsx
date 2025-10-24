'use client';
import getPembayaranTableData, { PembayaranTableRow } from "@/features/pembayaran/actions/getPembayaranTable";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { columns } from "@/features/pembayaran/columns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { header } from "framer-motion/client";

type Props = {
    search?: string;
    page?: number;
    size?: number;
}

export default function PembayaranTable({
    search,
    page,
    size,
}: Props) {
    const [data, setData] = useState<PembayaranTableRow[]>([]);

    useEffect(() => {
        async function fetchData() {
            const result = await getPembayaranTableData({ search, page, size })
            if (result.success && result.data) {
                setData(result.data)
            } else {
                console.error(result.message)
                setData([])
            }
        }
        fetchData()
    }, [search, page, size])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

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
                        <TableCell>
                            
                        </TableCell>
                    )
                ) : (

                )}
            </TableBody>
        </Table>
    );
}