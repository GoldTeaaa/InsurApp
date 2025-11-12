import getPelunasanPremiData from "@/features/laporan/pelunasan-premi/actions/getPelunasanPremiData";
import PelunasanPremiTable from "@/features/laporan/pelunasan-premi/PelunasanPremiTable";
import { searchParamsProps } from "@/lib/laporan/laporan-aging-premi/types";

export default async  function Page({
    searchParams
}: {searchParams: searchParamsProps}) {

    const response = await getPelunasanPremiData({ searchParams });
    if (!response.success) {
        throw new Error(response.message);
    }

    return (
        <div>
            <PelunasanPremiTable 
                data = {response.data ? response.data.rows : []}
            />
        </div>
    );
}