import LaporanProduksiTable from "@/features/laporan/produksi/LaporanProduksiTable";
import getLaporanProduksiData from "../../../../features/laporan/produksi/actions/getLaporanProduksiData";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import DateFilter from "@/components/DateFilter";
import { SearchParamsProps } from "@/lib/laporan/laporan-aging-premi/types";
import ExportOptions from "@/components/ExportOptions";

export default async function Page({
    searchParams
}: { searchParams: SearchParamsProps }) {
    const params = await searchParams;
    const search = params?.search ?? "";
    const page = Number(params?.page ?? 1);
    const size = Number(params?.size ?? 10);
    const startDate = params?.date_from;
    const endDate = params?.date_to;

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
            <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                <DateFilter />
                <ExportOptions 
                    laporanData={rowData}
                    startDate={startDate}
                    endDate={endDate}
                />
            </div>
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