"use client";

import {
    flexRender,
    useReactTable,
} from "@tanstack/react-table";
import { useCallback, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/table";
import { AddPembayaranPremiForm, addPembayaranPremiFormSchema, PremiHistoryRow } from "@/lib/pembayaran/pembayaran_premi/types";
import { columns } from "@/features/pembayaran/pembayaranPremi/premiHistory/PremiHistoryColumns";
import { getCoreRowModel } from "@tanstack/react-table";
import PremiFormDialog from "../PremiFormDialog";
import DeletePembayaranPremiAlertDialog from "./DeletePembayaranPremiAlertDialog";

type PremiHistoryTableProps = {
    onEditSuccess: () => void;
    onDeleteSuccess: () => void;
    premiHistoryData: PremiHistoryRow[]
};

export default function PremiHistoryTable({  
    onEditSuccess, 
    onDeleteSuccess,
    premiHistoryData 
}: PremiHistoryTableProps) {

    const [isDeleting, setIsDeleting] = useState(false);
    const [editingPremiId, setEditingPremiId] = useState<string | null>(null);
    const [deletingPremiId, setDeletingPremiId] = useState<string | null>(null);
    const [pembayaranPremiToEdit, setPembayaranPremiToEdit] = useState<AddPembayaranPremiForm | undefined>(undefined);

    const handleOpenEditDialog = useCallback((premiId: string) => {
        const premi = premiHistoryData.find(p => p.pembayaran_premi_id === premiId);
        if (premi) {
            const parseResult = addPembayaranPremiFormSchema.safeParse(premi);
            if (parseResult.success) {
                setPembayaranPremiToEdit(parseResult.data);
                setEditingPremiId(premiId);
            }
        }
    }, [premiHistoryData]);

    const handleEditSuccess = async () => {
        onEditSuccess(); // Propagate success to parent to refresh its data
        setEditingPremiId(null);
        setPembayaranPremiToEdit(undefined);
    }

    const handleOpenDeleteDialog = (pembayaranPremiId: string) => {
        setDeletingPremiId(pembayaranPremiId);
    };

    const table = useReactTable({
        data: premiHistoryData,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            onEdit: handleOpenEditDialog,
            onDelete: handleOpenDeleteDialog
        }
    });

    return (
        <>
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
                    {isDeleting ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Deleting...
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
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
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No history found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {editingPremiId && (
                <PremiFormDialog
                    id={editingPremiId}
                    isOpen={!!editingPremiId}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setEditingPremiId(null);
                            setPembayaranPremiToEdit(undefined);
                        }
                    }}
                    onSuccess={handleEditSuccess}
                    updateValues={pembayaranPremiToEdit}
                />
            )}
            {deletingPremiId && (
                <DeletePembayaranPremiAlertDialog
                deletePembayaranPremiId={deletingPremiId}
                    isOpen={!!deletingPremiId}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setDeletingPremiId(null)
                    }}
                    onDeleteSuccess={async () => {
                        setDeletingPremiId(null);
                        onEditSuccess();
                    }}
                />
            )}
        </>
    );
}