import getPelunasanPremiData from "@/features/laporan/pelunasan-premi/actions/getPelunasanPremiData";
import PelunasanPremiTable from "@/features/laporan/pelunasan-premi/PelunasanPremiTable";
import { SearchParamsProps } from "@/lib/laporan/laporan-aging-premi/types";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import DateFilter from "@/components/DateFilter";

export default async function Page({
    searchParams
}: { searchParams: SearchParamsProps }) {

    const response = await getPelunasanPremiData({ searchParams });
    if (!response.success) {
        throw new Error(response.message);
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
            <PelunasanPremiTable
                data={response.data ? response.data.rows : []}
            />
            <Pagination
                page={page}
                pageCount={Math.ceil((response.data?.total_count ?? 0) / size)}
            />
        </div>
    );
}