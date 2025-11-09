import LaporanProduksiTable from "@/features/laporan/produksi/LaporanProduksiTable";
import getLaporanProduksiData from "../actions.ts/getLaporanProduksiData";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";

// import { LaporanProduksiTable } from "@/lib/laporan/LaporanProduksiTable";

type searchParamsProps = {
    search: string,
    page: string,
    size: string
}

export default async function Page({
    searchParams
}: {searchParams: searchParamsProps}) {
    const params = await searchParams;
    const search = params?.search ?? "";
    const page = Number(params?.page ?? 1);
    const size = Number(params?.size ?? 10);

    const data = await getLaporanProduksiData({ search, page, size })
    if (!data.success) {
        throw new Error(data.message);
    }
    const rowData = data.data?.rows ?? [];
    const pageCount = Math.ceil((data.data?.total_count ?? 0) / size);
    
    return (
        <div>
            <Search
                placeholder="Cari nomor-polis / nama / asuransi"
                search={search}
            />
            <LaporanProduksiTable
                data={rowData}
            />
            <Pagination
                page={page}
                pageCount={pageCount}
            />
        </div>
    );
}