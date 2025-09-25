import { Suspense } from 'react';
import Table from '@/features/nasabah/table-view';
import Link from "next/link";
import Search from "@/features/nasabah/search";

export const metadata = { title: 'Nasabah' };

export default async function Page({
    searchParams
}: {
    searchParams?: { search?: string; page?: string; sort?: 'created_desc' | 'created_asc' | 'name_asc' | 'name_desc' };
}) {
    const params = await searchParams;
    const search = params?.search ?? '';
    const page = Number(params?.page ?? 1);
    const sort = (params?.sort ?? 'created_desc') as 'created_desc' | 'created_asc' | 'name_asc' | 'name_desc';

    return (
        <div className="w-full p-4">   
            <Search search = {search}/>
            <Suspense key={`${search}-${page}-${sort}`} fallback={<div className="mt-6 text-sm text-gray-500">Loading…</div>}>
                <Table search={search} page={page} sort={sort} />
            </Suspense>
            <Link
                href={"/dashboard/nasabah/create-nasabah"}
            >
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Nasabah
                </button>
            </Link>
            <Link
                href={"/dashboard/nasabah/tambah-nasabah"}
            >
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Tambah Nasabah
                </button>
            </Link>
        </div>
    );
}
