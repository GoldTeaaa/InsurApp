'use client';

import { HistoryPembayaranKomisiTableData } from "@/lib/pembayaran/pembayaran_komisi/types";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { komisiHistoryColumns } from "./KomisiHistoryColumns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { useState } from "react";
import PembayaranKomisiDialog from "../PembayaranKomisiDialog";

type Props = {
    komisiHistoryData: HistoryPembayaranKomisiTableData,
    onAddSuccess: () => void
}

export default function KomisiHistoryTable({
    komisiHistoryData,
    onAddSuccess
}: Props) {
    const [selectedPembayaranKomisiId, setSelectedPembayaranKomisiId] = useState<string | null>(null);

    const handleEditClick = (detailPembayaranKomisiId: string) => {
        setSelectedPembayaranKomisiId(detailPembayaranKomisiId);
    }

    const table = useReactTable({
        data: komisiHistoryData,
        columns: komisiHistoryColumns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            onEditPembayaranClick: handleEditClick
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
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={komisiHistoryColumns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {selectedPembayaranKomisiId && (
                <PembayaranKomisiDialog
                    detailPembayaranKomisiId={selectedPembayaranKomisiId}
                    isOpen={!!selectedPembayaranKomisiId}
                    onOpenChange={(isOpen) => {
                        if(!isOpen) setSelectedPembayaranKomisiId(null)
                    }}
                    mode="edit"
                    onAddSuccess={onAddSuccess}
                />
            )}
        </div>
    );
}