import DateFilter from "@/components/DateFilter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import getLapAgingKomisiData from "@/features/laporan/aging-komisi/actions/getLapAgingKomisiData";
import LaporanAgingKomisiTable from "@/features/laporan/aging-komisi/LaporanAgingKomisiTable";
import { AgingKomisiSearchParamsSchema } from "@/lib/laporan/laporan-aging-komisi/types";
import NormalizeSearchParams from "@/lib/normalizeSearchParams";
import { RawSearchParams } from "@/lib/types";

export default async function Page({
    searchParams
}: { searchParams: Promise<RawSearchParams> }) {

    const raw = await searchParams;
    const params = NormalizeSearchParams(raw);

    const parsedParams = AgingKomisiSearchParamsSchema.safeParse(params);
    if (!parsedParams.success) {
        return {
            success: false,
            message: parsedParams.error.message,
        };
    }

    const search = parsedParams.data.search ?? "";
    const page = Number(parsedParams.data.page ?? 1);
    const size = Number(parsedParams.data.size ?? 10);

    const response = await getLapAgingKomisiData({ searchParams: params });
    if (!response.success) {
        throw new Error(response.message);
    }
    const pageCount = Math.ceil((response.data?.total_count ?? 0) / size);

    return (
        <div>
            <div className="flex justify-between items-center w-full">
                <Search
                    placeholder="Cari nomor-polis / nama / asuransi"
                    search={search ?? ""}
                />
            </div>
            <DateFilter />
            <LaporanAgingKomisiTable
                data={response.data ? response.data.rows : []}
            />
            <Pagination
                page={page}
                pageCount={pageCount}
            />
        </div>
    );
}