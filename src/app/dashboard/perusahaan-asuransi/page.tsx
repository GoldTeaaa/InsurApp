import { Suspense } from "react";
import Link from "next/link";
import { perusahaanQuerySchema, type PerusahaanSort } from "@/lib/perusahaan_asuransi/types";
import Search from "@/features/perusahaan-asuransi/search";          // (q: string) => JSX
import Table from "@/features/perusahaan-asuransi/table-view";       // (q: string, page: number, sort: PerusahaanSortKey) => JSX

type RawSearchParams = {
    q?: string | string[];
    page?: string | string[];
    sort?: string | string[];
};

export default async function Page({ searchParams }: { searchParams?: RawSearchParams }) {
    const raw = await searchParams ?? {};
    const parsed = perusahaanQuerySchema.parse(raw);

    const q = parsed.q;
    const page = parsed.page;
    const sort = parsed.sort as PerusahaanSort;
    return (
        <div className="w-full p-4">
            <Search q={q} sort={sort} />
            <Suspense key={`${q}-${page}-${sort}`} fallback={<div className="mt-6 text-sm text-gray-500">Loading…</div>}>
                <Table q={q} page={page} sort={sort} />
            </Suspense>

            <div className="mt-6">
                <Link href={"/dashboard/perusahaan-asuransi/create-nasabah"}>
                    <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Create Perusahaan
                    </button>
                </Link>
            </div>
        </div>
    );
}