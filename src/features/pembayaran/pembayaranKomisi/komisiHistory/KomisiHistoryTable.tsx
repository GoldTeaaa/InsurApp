'use client';

import { HistoryPembayaranKomisiTableData, PembayaranKomisiFormSchema } from "@/lib/pembayaran/pembayaran_komisi/types";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { komisiHistoryColumns } from "./KomisiHistoryColumns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { useMemo, useState } from "react";
import PembayaranKomisiDialog from "../PembayaranKomisiDialog";
import DeleteKomisiAlertDialog from "@/features/pembayaran/pembayaranKomisi/komisiHistory/DeleteKomisiAlertDialog";

type Props = {
    komisiHistoryData: HistoryPembayaranKomisiTableData,
    onAddOrDeleteSuccess: () => void
}

export default function KomisiHistoryTable({
    komisiHistoryData,
    onAddOrDeleteSuccess
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

    const selectedRowForEdit = useMemo(() => {
        if (!selectedPembayaranKomisiId) return undefined;

        const rowToEdit = komisiHistoryData.find(
            row => row.pembayaran_komisi_id === selectedPembayaranKomisiId
        );

        const validatedRow = PembayaranKomisiFormSchema.safeParse(rowToEdit);

        if (!validatedRow.success) {
            console.error("Invalid row data:", validatedRow.error);
            return undefined;
        }
        return validatedRow.data;

    }, [komisiHistoryData, selectedPembayaranKomisiId]);

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
            {/* UPDATE PEMBAYARAN KOMISI ACTION */}
            {selectedPembayaranKomisiId && (
                <PembayaranKomisiDialog
                    pembayaranKomisiId={selectedPembayaranKomisiId}
                    isOpen={!!selectedPembayaranKomisiId}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setSelectedPembayaranKomisiId(null)
                    }}
                    mode="edit"
                    onAddOrDeleteSuccess={onAddOrDeleteSuccess}
                    updateValues={selectedRowForEdit}
                />
            )}
            {/* DELETE PEMBAYARAN KOMISI ACTION */}
            {deletePembayaranKomisiId && (
                <DeleteKomisiAlertDialog
                    isOpen={!!deletePembayaranKomisiId}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setDeletePembayaranKomisiId(null)
                    }}
                    deletePembayaranKomisiId={deletePembayaranKomisiId}
                    onDeleteSuccess={() => {
                        setDeletePembayaranKomisiId(null);
                        onAddOrDeleteSuccess(); // This will trigger a re-fetch in the parent
                    }}
                />
            )}
        </div>
    );
}