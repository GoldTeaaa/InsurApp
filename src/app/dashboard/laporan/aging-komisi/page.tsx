import getLapAgingKomisiData from "@/features/laporan/aging-komisi/actions/getLapAgingKomisiData";
import LaporanAgingKomisiTable from "@/features/laporan/aging-komisi/LaporanAgingKomisiTable";
import { AgingKomisiSearchParams } from "@/lib/laporan/laporan-aging-komisi/types";

export default async function Page({
    searchParams
}: {searchParams: AgingKomisiSearchParams}) {
    const response = await getLapAgingKomisiData(searchParams);
    if (!response.success) {
        throw new Error(response.message);
    }

    return (
        <div>
            <LaporanAgingKomisiTable 
                data = {response.data ? response.data.rows : []}
            />
        </div>
    );
}