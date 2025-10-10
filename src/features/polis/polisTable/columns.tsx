"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is imported from your server action file.
// It's good practice to have a central types file, but for now this works.
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

			return <div className="text-right font-medium">{formatted}</div>
		},
	},
	{
		accessorKey: "periode_mulai",
		header: "Periode Mulai",
	},
	{
		accessorKey: "periode_akhir",
		header: "Periode Akhir",
	},
	{
		accessorKey: "nama_perusahaan_asuransi",
		header: "Asuransi Penanggung",
	},
]