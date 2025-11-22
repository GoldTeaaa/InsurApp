import { LaporanAgingKomisiRows } from "@/lib/laporan/laporan-aging-komisi/types";
import LaporanTable from "../LaporanTable";
import { columnLapAgingKomisi } from "@/features/laporan/aging-komisi/columnLapAgingKomisi";

export default function LaporanAgingKomisiTable({
    data
}: {data: LaporanAgingKomisiRows}){
    return (
        <div>
            <LaporanTable
                // isExpandable={true}
                // renderSubComponent={DropdownLaporanRow}
                data={data}
                columns={columnLapAgingKomisi}
            />
        </div>
    );
}