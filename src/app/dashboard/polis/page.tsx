import { Suspense } from "react"
import Link from "next/link"
import PolisTable from "@/features/polis/polisTable/PolisTable"
import { Button } from "@/components/button"
import Pagination from "@/components/table/Pagination"
import getPolisTableData from "@/features/polis/actions/getPolisTable"
import { PolisRow, polisSearchSchema } from "@/features/polis/schema/table-types"
import { RawSearchParams } from "@/lib/types"
import { Plus } from "lucide-react"
import PolisStatCard from "@/features/polis/PolisStatCard"
import getPolisCardStats from "@/features/polis/actions/getPolisCardStats"
import PolisFilterBox from "@/features/polis/polisTable/PolisFilterBox"

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
	const tableData : PolisRow[] = res.success ? res.data?.rows ?? [] : [];
	const totalCount : number= res.success ? res.data?.total_count ?? 0 : 0;

	// The key for Suspense ensures it re-renders when search or pagination changes.
	const tableKey = `${search}-${page}-${size}`

	const cardProps = await getPolisCardStats();

	if (!cardProps.success) {
		throw new Error(cardProps.message);
	}

	const cardData = cardProps.data;

	return (
		<div className="w-full p-4 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Polis</h1>
				<Button className="w-fit" asChild>
					<Link href={"/dashboard/polis/buat-polis"}> <Plus /> Tambah Polis</Link>
				</Button>
			</div>
			<div className="flex flex-col items-stretch md:flex-row gap-4">
				<div className="w-full md:w-4/5">
					{/* <FilterBox />
					 */}
					<PolisFilterBox/>
				</div>
				<div className="w-full md:w-1/5 flex flex-row gap-2">
					{[
						{ title: "Total Polis", value: cardData?.total_semua_polis ?? 0 },
						{ title: "Polis Aktif", value: cardData?.total_polis_aktif ?? 0 },
						{ title: "Polis Tidak Aktif", value: cardData?.total_polis_tidak_aktif ?? 0 },
					].map((stat) => (
						<PolisStatCard key={stat.title} title={stat.title} value={stat.value} />
					))}
				</div>
			</div>
			<div className="p-4 space-y-4">
				<div>
					<Suspense key={tableKey} fallback={<div className="text-center p-8">Loading polis data...</div>}>
						<PolisTable
							data={tableData}
							jenis_bisnis={jenis_bisnis!}
						/>
					</Suspense>
					<Pagination page={page} pageCount={totalCount} />
				</div>
			</div>
		</div>
	)
}