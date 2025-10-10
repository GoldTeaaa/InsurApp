import { Suspense } from "react"
import Link from "next/link"
import PolisTable from "@/features/polis/polisTable/PolisTable"
import { Button } from "@/components/button"
import Search from "@/components/search"
import Pagination from "@/components/pagination"

export const metadata = { title: "Polis" }

export default async function Page({
	searchParams,
}: {
	searchParams?: { search?: string; page?: string; size?: string }
}) {
	const params = await searchParams;
	const search = params?.search ?? ""
	const page = Number(params?.page ?? 1)
	const size = Number(params?.size ?? 10)

	// The key for Suspense ensures it re-renders when search or pagination changes.
	const tableKey = `${search}-${page}-${size}`

	return (
		<div className="w-full p-4 space-y-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Polis</h1>
				<div className="w-1/3">
					<Search
						placeholder='Cari nama / email / kontak / alamat'
						search={search}
					/>
				</div>
			</div>
			<div>
				<Suspense key={tableKey} fallback={<div className="text-center p-8">Loading polis data...</div>}>
					<PolisTable search={search} page={page} size={size} />
				</Suspense>
				<Pagination page={page} pageCount={size} />
			</div>
			<Button asChild>
				<Link href={"/dashboard/polis/buat-polis"}>Tambah Polis</Link>
			</Button>
		</div>
	)
}