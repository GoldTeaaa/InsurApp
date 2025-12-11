import { type LaporanAgingPremiTable } from "@/lib/laporan/laporan-aging-premi/types";
import { columnLapAgingPremi } from "./columnLapAgingPremi";
import LaporanTable from "../LaporanTable";
import { AGING_RANGE } from "@/lib/types";

// type laporanAgingPremiRow

type laporanAgingPremiProps = {
    data: LaporanAgingPremiTable
}

export default function LaporanAgingPremiTable({
    data
}: laporanAgingPremiProps) {
    const pinAgingColumns = AGING_RANGE.map((range) => range);
    console.log("pinAgingColumns: ", pinAgingColumns);

    return (
        <div>   
            <LaporanTable
                isExpandable={true}
                // renderSubComponent={DropdownLaporanRow}
                data={data}
                columns={columnLapAgingPremi}
                // rightPin={pinAgingColumns}
            />
        </div>
    );

}