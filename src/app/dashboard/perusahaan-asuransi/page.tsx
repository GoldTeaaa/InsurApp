import { Suspense } from "react";
import Link from "next/link";
import { tableQuerySchema, type PerusahaanSort } from "@/lib/perusahaan_asuransi/types";
import Search from "@/components/Search";
import Table from "@/features/perusahaan-asuransi/table-view";
import { fetchPerusahaanPage } from "@/features/perusahaan-asuransi/actions/fetch-table-perusahaan";
import Pagination from "@/components/pagination";

type RawSearchParams = {
    q?: string;
    page?: number;
    sort?: PerusahaanSort;
};

export default async function Page({ searchParams }: { searchParams?: RawSearchParams }) {
    const raw = await searchParams ?? {};
    const parsed = tableQuerySchema.parse(raw);

    const search = parsed.q;
    const page = parsed.page;
    const sort = parsed.sort;

    const data = await fetchPerusahaanPage({ search, page, sort });

    return (
        <div className="w-full p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Nasabah</h1>
                <div className="w-1/3">
                    <Search
                        placeholder='Cari nama / email / kontak / alamat'
                        search={search}
                    />
                </div>
            </div>
            <Suspense key={`${search}-${page}-${sort}`} fallback={<div className="mt-6 text-sm text-gray-500">Loading…</div>}>
                <Table rows={data.rows} totalPage={data.total} />
            </Suspense>
            <Pagination page={page} pageCount={data.pageCount} />
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