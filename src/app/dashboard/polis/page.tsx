import { Suspense } from "react"
import Link from "next/link"
import PolisTable from "@/features/polis/polisTable/PolisTable"
import { Button } from "@/components/button"

export const metadata = { title: "Polis" }

export default async function Page({
	searchParams,
}: {
	searchParams?: { search?: string; page?: string; size?: string }
}) {
	const search = searchParams?.search ?? ""
	const page = Number(searchParams?.page ?? 1)
	const size = Number(searchParams?.size ?? 10)

	// The key for Suspense ensures it re-renders when search or pagination changes.
	const tableKey = `${search}-${page}-${size}`

	return (
		<div className="w-full p-4 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Daftar Polis</h1>
				<Button asChild>
					<Link href={"/dashboard/polis/buat-polis"}>Tambah Polis</Link>
				</Button>
			</div>

			{/* TODO: Add a Search component here */}

			<Suspense key={tableKey} fallback={<div className="text-center p-8">Loading polis data...</div>}>
				<PolisTable search={search} page={page} size={size} />
			</Suspense>
		</div>
	)
}