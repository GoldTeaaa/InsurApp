'use client';

import { HistoryPembayaranKomisiTableData } from "@/lib/pembayaran/pembayaran_komisi/types";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { komisiHistoryColumns } from "./KomisiHistoryColumns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { useState } from "react";
import PembayaranKomisiDialog from "../PembayaranKomisiDialog";
import DeleteKomisiAlertDialog from "@/features/pembayaran/pembayaranKomisi/komisiHistory/DeleteKomisiAlertDialog";

type Props = {
    komisiHistoryData: HistoryPembayaranKomisiTableData,
    onAddSuccess: () => void
}

export default function KomisiHistoryTable({
    komisiHistoryData,
    onAddSuccess
}: Props) {
    const [selectedPembayaranKomisiId, setSelectedPembayaranKomisiId] = useState<string | null>(null);
    const [deletePembayaranKomisiId, setDeletePembayaranKomisiId] = useState<string | null>(null);

    const handleEditClick = (detailPembayaranKomisiId: string) => {
        setSelectedPembayaranKomisiId(detailPembayaranKomisiId);
    }

    const handleDeleteClick = (detailPembayaranKomisiId: string) => {
        setDeletePembayaranKomisiId(detailPembayaranKomisiId);
    }

    const table = useReactTable({
        data: komisiHistoryData,
        columns: komisiHistoryColumns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            onEditPembayaranClick: handleEditClick,
            onDeletePembayaranClick: handleDeleteClick
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
                // UPDATE ROW
                <PembayaranKomisiDialog
                    pembayaranKomisiId={selectedPembayaranKomisiId}
                    isOpen={!!selectedPembayaranKomisiId}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setSelectedPembayaranKomisiId(null)
                    }}
                    mode="edit"
                    onAddSuccess={onAddSuccess}
                    updateValues={komisiHistoryData.find(
                        row => row.pembayaran_komisi_id === selectedPembayaranKomisiId
                    )}
                // TODO: Add update values
                />
            )}
            {
                deletePembayaranKomisiId && (
                    <DeleteKomisiAlertDialog
                        isOpen={!!deletePembayaranKomisiId}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) setDeletePembayaranKomisiId(null)
                        }}
                        deletePembayaranKomisiId={deletePembayaranKomisiId}
                        onDeleteSuccess={() => {
                            setDeletePembayaranKomisiId(null);
                            onAddSuccess(); // This will trigger a re-fetch in the parent
                        }}
                    />
                )
            }
        </div>
    );
}