import DateFilter from "@/components/DateFilter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import getLapAgingPremiData from "@/features/laporan/aging-premi/actions/getLapAgingPremiData";
import LaporanAgingPremiTable from "@/features/laporan/aging-premi/LaporanAgingPremiTable";
import NormalizeSearchParams from "@/lib/normalizeSearchParams";
import { RawSearchParams, SearchParamsSchema } from "@/lib/types";

export default async function Page({
    searchParams
}: { searchParams: Promise<RawSearchParams> }) {

    const raw = await searchParams;
    const params = NormalizeSearchParams(raw);

    const parsedParams = SearchParamsSchema.safeParse(params);
    if (!parsedParams.success) {
        return {
            success: false,
            message: parsedParams.error.message,
        };
    }
    const parsedParamsData = parsedParams.data;

    const search = parsedParamsData.search ?? "";
    const page = Number(parsedParamsData.page ?? 1);
    const size = Number(parsedParamsData.size ?? 10);

    const response = await getLapAgingPremiData({ searchParams: parsedParamsData });
    if (!response.success) {
        throw new Error(response.message)
    }

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