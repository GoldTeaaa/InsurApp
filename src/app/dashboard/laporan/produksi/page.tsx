import LaporanProduksiTable from "@/features/laporan/produksi/LaporanProduksiTable";
import getLaporanProduksiData from "../../../../features/laporan/produksi/actions/getLaporanProduksiData";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import DateFilter from "@/components/DateFilter";
import { searchParamsProps } from "@/lib/laporan/laporan-aging-premi/types";

export default async function Page({
    searchParams
}: { searchParams: searchParamsProps }) {
    const params = await searchParams;
    const search = params?.search ?? "";
    const page = Number(params?.page ?? 1);
    const size = Number(params?.size ?? 10);

    const data = await getLaporanProduksiData({searchParams})
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
            <DateFilter />
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