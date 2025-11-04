'use client';
import { komisiTableRowData } from "@/lib/pembayaran/pembayaran_komisi/types";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { komisiColumnAttributes } from "./columnPembayaranKomisi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { useState } from "react";
import KomisiHistoryDialog from "./komisiHistory/KomisiHistoryDialog";
import PembayaranKomisiDialog from "@/features/pembayaran/pembayaranKomisi/PembayaranKomisiDialog";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function KomisiPembayaranTable({ data }: { data: komisiTableRowData[] }) {
    const [selectedKomisiId, setSelectedKomisiId] = useState<string | null>(null);
    const [selectedDetailKomisiId, setSelectedDetailKomisiId] = useState<string | null>(null);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const router = useRouter();

    const handleRowClick = (detailKomisiId: string) => {
        setSelectedKomisiId(detailKomisiId);
    }

    const handleAddPembayaran = (detailKomisiId: string) => {
        setSelectedDetailKomisiId(detailKomisiId);
        setMode("add");
    }

    const queryClient = useQueryClient();
    const handleAddEditOrDeleteSuccess = (detailKomisiId: string) => {
        router.refresh();
        queryClient.invalidateQueries({
            queryKey: ["history-pembayaran-komisi", detailKomisiId]
        });
        setSelectedDetailKomisiId(null);
    }

    const selectedKomisiData = selectedKomisiId
        ? data.find((item) => item.polis_share_id === selectedKomisiId)
        : undefined;


    const table = useReactTable({
        data,
        columns: komisiColumnAttributes,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            onRowClick: handleRowClick,
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
            {selectedKomisiId && selectedKomisiData && (
                <KomisiHistoryDialog
                    detailKomisiId={selectedKomisiId}
                    detailKomisiData={selectedKomisiData}
                    isOpen={!!selectedKomisiId}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setSelectedKomisiId(null)
                    }}
                    addPembayaranKomisi={() => handleAddPembayaran(selectedKomisiId)}
                    onAddOrDeleteSuccess={() => handleAddEditOrDeleteSuccess(selectedKomisiId)}
                />
            )}
            {/* ADD PEMBAYARAN KOMISI */}
            {selectedDetailKomisiId && (
                <PembayaranKomisiDialog
                    detailKomisiId={selectedDetailKomisiId}
                    isOpen={!!selectedDetailKomisiId}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setSelectedDetailKomisiId(null)
                    }}
                    mode={mode}
                    onAddOrDeleteSuccess={() => handleAddEditOrDeleteSuccess(selectedDetailKomisiId)}
                />
            )
            }
        </div>
    );
}