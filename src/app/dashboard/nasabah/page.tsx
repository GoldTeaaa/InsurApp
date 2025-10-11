import { Suspense } from 'react';
import Table from '@/features/nasabah/table-view';
import Link from "next/link";
import Search from "@/components/Search";
import Pagination from '@/components/pagination';
import { fetchNasabahPage } from '@/features/nasabah/actions/fetch-table-page';
import { tableQuerySchema } from '@/lib/types';
import { NasabahSort } from '@/lib/nasabah/types';

type RawSearchParams = {
    search?: string;
    page?: number;
    sort?: NasabahSort
};

export default async function Page({
    searchParams
}: {
    searchParams?: RawSearchParams;
}) {
    const raw = await searchParams;
    const params = tableQuerySchema.parse(raw);
    const { search, page, sort } = params

    const { rows, total, pageCount } = await fetchNasabahPage({ search, page });

    return (
        <div>
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
                    <>
                        <Table rows={rows} total={total} pageCount={pageCount} />
                        <Pagination page={page} pageCount={pageCount} />
                    </>
                </Suspense>
            </div>
            <div>
                {/* <Link
                    href={"/dashboard/nasabah/create-nasabah"}
                >
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Create Nasabah
                    </button>
                </Link> */}
                <Link
                    href={"/dashboard/nasabah/tambah-nasabah"}
                >
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Tambah Nasabah
                    </button>
                </Link>
            </div>
        </div>
    );
}
