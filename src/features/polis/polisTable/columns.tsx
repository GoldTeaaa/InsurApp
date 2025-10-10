"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import { Button } from "@/components/button"
import PolisDropdown from "@/components/dropdown"

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

function dateFormater(dateString: string) {
	const date = new Date(dateString)
	const day = String(date.getDate()).padStart(2, "0")
	const month = String(date.getMonth() + 1).padStart(2, "0") // Months are 0-indexed
	const year = date.getFullYear()

	return (
		<div>
			{`${day}-${month}-${year}`}
		</div>
	);
}

export const columns: ColumnDef<PolisTableRow>[] = [
	{
		accessorKey: "nomor_polis",
		header: "Nomor Polis",
	},
	{
		accessorKey: "bisnis",
		header: "Bisnis",
	},
	{
		accessorKey: "nama_nasabah",
		header: "Nama Nasabah",
	},
	{
		accessorKey: "total_premi",
		header: "Total Premi",
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("total_premi"))
			const formatted = new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
			}).format(amount)

			return <div className="text-left font-medium">{formatted}</div>
		},
	},
	{
		accessorKey: "periode_mulai",
		header: "Periode Mulai",
		cell: ({ row }) => {
			const dateString = row.getValue<string>("periode_mulai")
			if (!dateString) return null
			return(
				dateFormater(dateString)
			)
		},
	},
	{
		accessorKey: "periode_akhir",
		header: "Periode Akhir",
		cell: ({ row }) => {
			const dateString = row.getValue<string>("periode_akhir")
			if (!dateString) return null
			return(
				dateFormater(dateString)
			)
		},
	},
	{
		accessorKey: "nama_perusahaan_asuransi",
		header: "Asuransi Penanggung",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const polis = row.original
			return (
				<PolisDropdown
					id={polis.id}
				/>
			)
		},
	},
]