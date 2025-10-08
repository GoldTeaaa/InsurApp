"use client"

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/table"

import getPolisTableData from "../actions/polis-table"
import { PolisTableQuery } from "@/lib/polis/table-types"
import { useEffect, useState } from "react"
import { columns } from "./columns"

type PolisTableRow = {
	id: string
	nomor_polis: string
	bisnis: string
	nama_nasabah: string | null
	total_premi: number | null
	periode_mulai: string
	periode_akhir: string
	nama_perusahaan_asuransi: string | null
	full_count: number
}

export default function PolisTable({search, page, size}: PolisTableQuery) {
	const [data, setData] = useState<PolisTableRow[]>([])
	const [rowCount, setRowCount] = useState(0)

	useEffect(() => {
		async function fetchData() {
			const result = await getPolisTableData({ search, page, size })
			if (result.success && result.data) {
				setData(result.data)
				if (result.data.length > 0) {
					setRowCount(result.data[0].full_count)
				}
			} else {
				// Handle error case, maybe show a toast notification
				console.error(result.message)
				setData([])
				setRowCount(0)
			}
		}
		fetchData()
	}, [search, page, size])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		rowCount: rowCount,
		manualPagination: true, // Since we are fetching data per page
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
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map(cell => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}