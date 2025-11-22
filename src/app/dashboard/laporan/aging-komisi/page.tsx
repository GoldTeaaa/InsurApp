import DateFilter from "@/components/DateFilter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import getLapAgingKomisiData from "@/features/laporan/aging-komisi/actions/getLapAgingKomisiData";
import LaporanAgingKomisiTable from "@/features/laporan/aging-komisi/LaporanAgingKomisiTable";
import { AgingKomisiSearchParams } from "@/lib/laporan/laporan-aging-komisi/types";

export default async function Page({
    searchParams
}: { searchParams: AgingKomisiSearchParams }) {

    const params = await searchParams;
    const search = params.search ?? "";
    const page = Number(params.page ?? 1);
    const size = Number(params.size ?? 10);

    const response = await getLapAgingKomisiData({searchParams});
    if (!response.success) {
        throw new Error(response.message);
    }

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
                pageCount={Math.ceil((response.data?.total_count ?? 0) / size)}
            />
        </div>
    );
}