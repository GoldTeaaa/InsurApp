import getPelunasanPremiData from "@/features/laporan/pelunasan-premi/actions/getPelunasanPremiData";
import PelunasanPremiTable from "@/features/laporan/pelunasan-premi/PelunasanPremiTable";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import DateFilter from "@/components/DateFilter";
import { RawSearchParams, SearchParamsSchema } from "@/lib/types";
import NormalizeSearchParams from "@/lib/normalizeSearchParams";

export default async function Page({
    searchParams
}: { searchParams: Promise<RawSearchParams> }) {
    
    const raw = await searchParams;
    const normalized = NormalizeSearchParams(raw);

    const parsed = SearchParamsSchema.safeParse(normalized);
    if (!parsed.success) {
        throw new Error(parsed.error.message);
    }
    const params = parsed.data;

    const search = params.search ?? "";
    const page = Number(params.page ?? 1);
    const size = Number(params.size ?? 10);

    const response = await getPelunasanPremiData({ searchParams: params });
    if (!response.success) {
        throw new Error(response.message);
    }
    
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