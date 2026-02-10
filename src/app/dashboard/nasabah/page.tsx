import { Suspense } from 'react';
import Search from "@/components/Search";
import Pagination from '@/components/table/Pagination';
import NasabahTable from '@/features/nasabah/table/nasabah-table';
import { NasabahTableSearchParams } from '@/lib/nasabah/type';
import fetchNasabahPage from '@/features/nasabah/actions/fetch-table-page';
import AddNasabahDrawer from '@/features/nasabah/AddNasabahDrawer';
import TableShell from '@/components/table/TableShell';

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

                    <AddNasabahDrawer />
                </div>
                <TableShell
                    search={
                        <Search
                            placeholder='Cari nama / email / kontak / alamat'
                            search={search}
                        />
                    }
                    table={<NasabahTable data={rows} />}
                    pagination={<Pagination page={page} pageCount={pageCount} />}
                />
            </div>
        </div>
    );
}
