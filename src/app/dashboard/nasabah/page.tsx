import { Suspense } from 'react';
import Table from '@/features/nasabah/table-view';
import Link from "next/link";
import Search from "@/features/nasabah/search";

export const metadata = { title: 'Nasabah' };

export default async function Page({
    searchParams,
}: {
    searchParams?: { q?: string; page?: string; sort?: 'created_desc' | 'created_asc' | 'name_asc' | 'name_desc' };
}) {
    const search = await searchParams;
    const q = search?.q ?? '';
    const page = Number(search?.page ?? 1);
    const sort = (search?.sort ?? 'created_desc') as 'created_desc' | 'created_asc' | 'name_asc' | 'name_desc';

    return (
        <div className="w-full p-4">   
            <Search q = {q}/>
            <Suspense key={`${q}-${page}-${sort}`} fallback={<div className="mt-6 text-sm text-gray-500">Loading…</div>}>
                <Table q={q} page={page} sort={sort} />
            </Suspense>
            <Link
                href={"/dashboard/nasabah/create-nasabah"}
            >
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Nasabah
                </button>
            </Link>
        </div>
    );
}
