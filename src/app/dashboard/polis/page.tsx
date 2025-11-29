import { Suspense } from "react"
import Link from "next/link"
import PolisTable from "@/features/polis/polisTable/PolisTable"
import { Button } from "@/components/button"
import Search from "@/components/Search"
import Pagination from "@/components/Pagination"
import getPolisTableData from "@/features/polis/actions/get-polis-table"
import { polisSearchSchema } from "@/lib/polis/table-types"
import { RawSearchParams } from "@/lib/types"
import PolisBisnisFilter from "@/components/PolisBisnisFilter"
import FilterBox from "@/components/FilterBox"

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<RawSearchParams>
}) {
	const raw = await searchParams;

	const parsed = polisSearchSchema.safeParse(raw);
	if (!parsed.success) {
		throw new Error(parsed.error.message);
	}

	const params = parsed.data;
	const search = params?.search ?? ""
	const page = Number(params?.page ?? 1)
	const size = Number(params?.size ?? 10)
	const jenis_bisnis = params?.jenis_bisnis ?? null

	const res = await getPolisTableData({ searchParams: params });
	if (!res.success) {
		throw new Error(res.message)
	}

	const data = res.data?.rows ?? [];
	const totalCount = Math.ceil((res.data?.total_count ?? 0) / size);

	// The key for Suspense ensures it re-renders when search or pagination changes.
	const tableKey = `${search}-${page}-${size}`

	return (
		<div className="w-full p-4 space-y-4">
			<h1 className="text-2xl font-bold">Polis</h1>
			<div className="w-full border border-zinc-300 rounded-md p-4 space-y-4">
				<FilterBox />
				<div>
					<Suspense key={tableKey} fallback={<div className="text-center p-8">Loading polis data...</div>}>
						<PolisTable
							data={data}
							jenis_bisnis={jenis_bisnis!}
						/>
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