import DateFilter from "@/components/DateFilter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import getPelunasanKomisiData from "@/features/laporan/pelunasan-komisi/actions/getPelunasanKomisiData";
import PelunasanKomisiTable from "@/features/laporan/pelunasan-komisi/PelunasanKomisiTable";
import NormalizeSearchParams from "@/lib/normalizeSearchParams";
import { RawSearchParams, SearchParamsSchema } from "@/lib/types";

export default async function Page({
    searchParams
}: { searchParams: Promise<RawSearchParams> }) {

    const raw = await searchParams;
    const normalized = NormalizeSearchParams(raw);
    const parsed = SearchParamsSchema.safeParse(normalized);
    
    if (!parsed.success) {
        return {
            success: false,
            message: parsed.error.message,
        };
    }
    const params = parsed.data;

    const search = params.search ?? "";
    const page = Number(params.page ?? 1);
    const size = Number(params.size ?? 10);

    const data = await getPelunasanKomisiData({ searchParams })

    if (!data.success) {
        throw new Error(data.message);
    }

    return (
        <div>
            <Search
                placeholder="Cari nomor-polis / nama / asuransi"
                search={search}
            />
            <DateFilter />
            <PelunasanKomisiTable
                data={data.data ? data.data.rows : []}
            />
            <Pagination
                page={page}
                pageCount={Math.ceil((data.data?.total_count ?? 0) / size)}
            />
        </div>
    );
}