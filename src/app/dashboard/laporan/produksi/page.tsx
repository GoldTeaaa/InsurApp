import LaporanProduksiTable from "@/features/laporan/produksi/LaporanProduksiTable";
import getLaporanProduksiData from "../../../../features/laporan/produksi/actions/getLaporanProduksiData";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import DateFilter from "@/components/DateFilter";
import ExportOptions from "@/components/ExportOptions";
import { RawSearchParams, SearchParamsSchema } from "@/lib/types";

export default async function Page({
    searchParams
}: { searchParams: Promise<RawSearchParams> }) {

    const raw = await searchParams;
    const parsed = SearchParamsSchema.safeParse(raw);
    if (!parsed.success) {
        throw new Error(parsed.error.message);
    }
    const params = parsed.data;

    const search = params?.search ?? "";
    const page = Number(params?.page ?? 1);
    const size = Number(params?.size ?? 10);
    const startDate = params?.date_from ? params.date_from : "";
    const endDate = params?.date_to ? params.date_to : "";

    const data = await getLaporanProduksiData({searchParams: params});
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