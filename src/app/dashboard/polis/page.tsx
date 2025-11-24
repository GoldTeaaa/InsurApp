import { Suspense } from "react"
import Link from "next/link"
import PolisTable from "@/features/polis/polisTable/PolisTable"
import { Button } from "@/components/button"
import Search from "@/components/Search"
import Pagination from "@/components/Pagination"
import getPolisTableData from "@/features/polis/actions/get-polis-table"
import { PolisTableRow } from "@/lib/polis/table-types"
import { RawSearchParams, SearchParamsSchema } from "@/lib/types"
import NormalizeSearchParams from "@/lib/normalizeSearchParams"

export const metadata = { title: "Polis" }

export default async function Page({
	searchParams,
}: {
	searchParams : Promise<RawSearchParams>
}) {
	const raw = await searchParams;
	const normalized = NormalizeSearchParams(raw);

	const parsed = SearchParamsSchema.safeParse(normalized);
	if (!parsed.success) {
		throw new Error(parsed.error.message);
	}
	
	const params = parsed.data;
	const search = params?.search ?? ""
	const page = Number(params?.page ?? 1)
	const size = Number(params?.size ?? 10)

	const data = await getPolisTableData({ search, page, size });
	if (!data.success) {
		throw new Error(data.message)
	}

	const tableData = data.data ? data.data as PolisTableRow[] : []
	const totalCount = tableData.length > 0 ? Math.ceil(tableData[0].full_count / size) : 0

	// The key for Suspense ensures it re-renders when search or pagination changes.
	const tableKey = `${search}-${page}-${size}`	

	return (
		<div className="w-full p-4 space-y-4">
			<h1 className="text-2xl font-bold">Polis</h1>
			<div className="w-full border border-zinc-300 rounded-md p-4">
				<div className="flex justify-between items-center mb-4">
					<div className="w-1/3">
						<Search
							placeholder='Cari nama / email / kontak / alamat'
							search={search}
						/>
					</div>
				</div>
				<div>
					<Suspense key={tableKey} fallback={<div className="text-center p-8">Loading polis data...</div>}>
						<PolisTable data={tableData} />
					</Suspense>
					<Pagination page={page} pageCount={totalCount} />
				</div>
			</div>
			<Button asChild>
				<Link href={"/dashboard/polis/buat-polis"}>Tambah Polis</Link>
			</Button>
		</div>
	)
}