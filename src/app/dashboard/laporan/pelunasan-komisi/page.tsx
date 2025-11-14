import DateFilter from "@/components/DateFilter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import getPelunasanKomisiData from "@/features/laporan/pelunasan-komisi/actions/getPelunasanKomisiData";
import PelunasanKomisiTable from "@/features/laporan/pelunasan-komisi/PelunasanKomisiTable";
import { searchParamsProps } from "@/lib/laporan/laporan-aging-premi/types";

export default async function Page({
    searchParams
}: { searchParams: searchParamsProps }) {
    const data = await getPelunasanKomisiData({ searchParams })

    const params = await searchParams;
    const search = params.search ?? "";
    const page = Number(params.page ?? 1);
    const size = Number(params.size ?? 10);

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