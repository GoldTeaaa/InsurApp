import LaporanTable from "@/features/laporan/LaporanTable";
import { type PelunasanPremiTable } from "@/lib/laporan/laporan-pelunasan-premi/types";
import { columnLapPelunasanPremi } from "@/features/laporan/pelunasan-premi/columnPelunasanPremi";

export default function PelunasanPremiTable({
    data
}:{data: PelunasanPremiTable}){
    return (
        <div>
            <LaporanTable
                // isExpandable={true}
                // renderSubComponent={DropdownLaporanRow}
                data={data}
                columns={columnLapPelunasanPremi}
            />
        </div>
    );

}