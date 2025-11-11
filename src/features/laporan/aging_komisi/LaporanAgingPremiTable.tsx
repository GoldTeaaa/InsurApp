import { type LaporanAgingPremiTable } from "@/lib/laporan/laporan-aging/types";
import { columnLapAgingPremi } from "./columnLapAgingPremi";
import LaporanTable from "../LaporanTable";

// type laporanAgingPremiRow

type laporanAgingPremiProps = {
    data: LaporanAgingPremiTable
}

export default function LaporanAgingPremiTable({
    data
}: laporanAgingPremiProps) {
    return (
        <div>
            <LaporanTable
                // isExpandable={true}
                // renderSubComponent={DropdownLaporanRow}
                data={data}
                columns={columnLapAgingPremi}
            />
        </div>
    );

}