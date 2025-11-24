import { Suspense } from 'react';
import Link from "next/link";
import Search from "@/components/Search";
import Pagination from '@/components/Pagination';
import NasabahTable from '@/features/nasabah/table/nasabah-table';
import { NasabahTableSearchParams } from '@/lib/nasabah/type';
import fetchNasabahPage from '@/features/nasabah/actions/fetch-table-page';

export default async function Page({
    searchParams
}: {
    searchParams: Promise<NasabahTableSearchParams>;
}) {
    const params = await searchParams;
    const search = params?.search ?? "";
    const page = Number(params?.page ?? 1);
    const size = Number(params?.size ?? 10);

    const response = await fetchNasabahPage({ searchParams: params });
    if (!response.success) {
        throw new Error(response.message);
    }

    const rows = response.data ? response.data.rows : [];
    const pageCount = Math.ceil((response.data?.total_count ?? 0) / size);

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
                <Suspense key={`${search}-${page}`} fallback={<div className="mt-6 text-sm text-gray-500">Loading…</div>}>
                    <>
                        <NasabahTable 
                            data={rows}
                        />
                        <Pagination
                            page={page}
                            pageCount={pageCount}
                        />
                    </>
                </Suspense>
            </div>
            <div>
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
