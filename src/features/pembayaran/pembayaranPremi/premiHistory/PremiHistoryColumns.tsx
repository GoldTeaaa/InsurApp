"use client";

import { PremiHistoryRow } from "@/lib/pembayaran/pembayaran_premi/types";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import EditOrDeletePremiDropdown from "@/features/pembayaran/pembayaranPremi/premiHistory/EditOrDeletePremiDropdown";

type ActionProps = {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const columns : ColumnDef<PremiHistoryRow>[] = [
    {
        accessorKey: "tanggal_bayar",
        header: "Tanggal Bayar",
        cell: ({ getValue }) => {
            const dateString = getValue<string>();
            if (!dateString) return "-";
            const date = parseISO(dateString);
            return format(date, "dd MMMM yyyy");
        },
    },
    {
        accessorKey: "amount_paid",
        header: "Jumlah Bayar",
        cell: ({ getValue }) => {
            const amount = getValue<number>();
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }).format(amount);
        },
    },
    {
        accessorKey: "cara_bayar",
        header: "Cara Bayar",
    },
    {
        accessorKey: "ref_no",
        header: "Ref No",
    },
    {
        accessorKey: "rekening_bank",
        header: "Rekening Bank",
    },{
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
            const pembayaran = row.original;
            const {
                onEdit,
                onDelete
            } = table.options.meta as ActionProps
            return (
                <EditOrDeletePremiDropdown
                    pembayaranPremiId={pembayaran.pembayaran_premi_id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )
        }
    }
];