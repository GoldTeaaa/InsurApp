"use client"

import { ColumnDef } from "@tanstack/react-table"
import PolisDropdown from "@/features/polis/polisTable/dropdown"
import AsuransiPenanggungCell from "./AsuransiPenanggungCell"
import { JenisBisnis } from "@/lib/types"
import { PolisRow } from "@/features/polis/schema/table-types"
import Link from "next/link"

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

export function getColumns(jenis_bisnis?: JenisBisnis): ColumnDef<PolisRow>[] {
	const baseColumns: ColumnDef<PolisRow>[] = [
		{
			accessorKey: "nomor_polis",
			header: "Nomor Polis",
			cell: ({ row }) => {
				const id = row.original.id;
				return (
					<Link href={`/dashboard/polis/${id}/edit`}>
						{row.getValue("nomor_polis")}
					</Link>
				)
			}
		},
		{
			accessorKey: "jenis_coas",
			header: "Jenis Coas",
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
				return (
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
				return (
					dateFormater(dateString)
				)
			},
		},
		{
			accessorKey: "list_perusahaan_asuransi",
			header: "Asuransi Penanggung",
			cell: ({ row }) => {
				const insurers = row.getValue<Array<string>>("list_perusahaan_asuransi")
				console.log("insurers: ", insurers);
				return (
					<AsuransiPenanggungCell insurers={insurers} />
				)
			},
		},
	]

	const kendaraanColumns: ColumnDef<PolisRow>[] = [
		{
			accessorKey: "plat_nomor",
			header: "Plat Nomor",
		},
		{
			accessorKey: 'jenis_kendaraan',
			header: 'Jenis Kendaraan',
		}
	]

	const actions: ColumnDef<PolisRow>[] = [
		{
			id:'actions',
			cell: ({row}) => {
				const id = row.original.id
				return (
					<PolisDropdown id={id} />
				)
			}
		}
	]
	
	const jenis = jenis_bisnis ?? "all"
	if (jenis === "kendaraan") {
		return [...baseColumns, ...kendaraanColumns, ...actions]
	}

	return [...baseColumns, ...actions]
}