"use client";

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import getPremiHistoryDetails from "../actions/getPremiHistoryDetails";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/table";
import { AddPembayaranPremiForm, addPembayaranPremiFormSchema, PremiHistoryRow } from "@/lib/pembayaran/pembayaran_premi/types";
import { columns } from "@/features/pembayaran/premiHistory/PremiHistoryColumns";
import PremiFormDialog from "../PremiFormDialog";
import { set } from "date-fns";

type PremiHistoryTableProps = {
    detailPremiId: string;
    onEditSuccess: () => void;
};

export default function PremiHistoryTable({ detailPremiId, onEditSuccess }: PremiHistoryTableProps) {
    const [data, setData] = useState<PremiHistoryRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingPremiId, setEditingPremiId] = useState<string | null>(null);
    const [pembayaranPremiToEdit, setPembayaranPremiToEdit] = useState<AddPembayaranPremiForm | undefined>(undefined);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const result = await getPremiHistoryDetails({ detailPremiId });
            if (result.success && result.data) {
                setData(result.data);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [detailPremiId]);

    const handleOpenEditDialog = useCallback((premiId: string) => {
        const premi = data.find(p => p.pembayaran_id === premiId);
        if (premi) {
            const parseResult = addPembayaranPremiFormSchema.safeParse(premi);
            if (parseResult.success) {
                setPembayaranPremiToEdit(parseResult.data);
                setEditingPremiId(premiId);
            }
        }
    }, [data]);

    const handleEditSuccess = () => {
        async function refetch() {
            const result = await getPremiHistoryDetails({ detailPremiId });
            if (result.success && result.data) {
                setData(result.data);
            }
        }
        refetch();
        onEditSuccess(); // Propagate success to parent to refresh its data
        setEditingPremiId(null);
        setPembayaranPremiToEdit(undefined);
    }

    const tableColumns = useMemo(() => columns({
        onEdit: handleOpenEditDialog
    }), [handleOpenEditDialog]);

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
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
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                                Loading...
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
                                colSpan={tableColumns.length}
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
        </>
    );
}