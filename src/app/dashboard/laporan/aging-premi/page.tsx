import getLapAgingPremiData from "@/features/laporan/aging_komisi/actions.ts/getLapAgingPremiData";
import LaporanAgingPremiTable from "@/features/laporan/aging_komisi/LaporanAgingPremiTable";
import { searchParamsProps } from "@/lib/laporan/laporan-aging/types";

export default async function Page({
    searchParams
}: {searchParams: searchParamsProps}) {

    const response = await getLapAgingPremiData({ searchParams })
    if (!response.success) {
        throw new Error(response.message)
    }

    return (
        <div>
            <LaporanAgingPremiTable
                data = {response.data? response.data.rows : []}
            />
        </div>
    );
}