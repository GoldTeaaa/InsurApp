'use client';
import getPembayaranTableData, { PembayaranTableRow } from "@/features/pembayaran/actions/getPembayaranTable";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { columns } from "@/features/pembayaran/columns";

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
    const[data, setData] = useState<PembayaranTableRow[]>([]);

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
    },[search, page, size])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return(
        <div>
            
        </div>
    );
}