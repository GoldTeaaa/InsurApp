import DateFilter from "@/components/DateFilter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import getLapAgingPremiData from "@/features/laporan/aging-premi/actions/getLapAgingPremiData";
import LaporanAgingPremiTable from "@/features/laporan/aging-premi/LaporanAgingPremiTable";
import { SearchParamsProps } from "@/lib/laporan/laporan-aging-premi/types";

export default async function Page({
    searchParams
}: { searchParams: SearchParamsProps }) {

    const response = await getLapAgingPremiData(searchParams)
    if (!response.success) {
        throw new Error(response.message)
    }
    const params = await searchParams;
    const search = params.search ?? "";
    const page = Number(params.page ?? 1);
    const size = Number(params.size ?? 10);

    return (
        <div>
            <Search
                placeholder="Cari nomor-polis / nama / asuransi"
                search={search ?? ""}
            />
            <DateFilter />
            <LaporanAgingPremiTable
                data={response.data ? response.data.rows : []}
            />
            <Pagination
                page={page}
                pageCount={Math.ceil((response.data?.total_count ?? 0) / size)}
            />
        </div>
    );
}