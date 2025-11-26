'use client';
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/table";
import { PerusahaanAsuransiColumns } from "./columns";
import { PerusahaanList } from "@/lib/perusahaan_asuransi/types";
import { useRouter } from "next/navigation";
import deletePerusahaanAction from "./actions/delete";
import { toast } from "sonner";

export default function PerusahaanAsuransiTable({
    data
}: { data: PerusahaanList }) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try{
            const result = await deletePerusahaanAction(id);
            if(result.success){
                router.refresh();
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
        }catch(e){
            console.error(e);
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/dashboard/perusahaan-asuransi/${id}/edit`);
    };

    const table = useReactTable({
        data,
        columns: PerusahaanAsuransiColumns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            handleDelete,
            handleEdit
        }
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
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
                        table.getRowModel().rows.map(row => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={PerusahaanAsuransiColumns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}