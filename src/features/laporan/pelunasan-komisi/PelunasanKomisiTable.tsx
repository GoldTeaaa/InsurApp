import { LaporanPelunasanKomisiTable } from "@/lib/laporan/laporan-pelunasan-komisi/types";
import LaporanTable from "@/features/laporan/LaporanTable";
import { columnLapPelunasanKomisi } from "@/features/laporan/pelunasan-komisi/ColumnPelunasanKomisi";

export default function PelunasanKomisiTable({
    data
}: {data: LaporanPelunasanKomisiTable}){
    return (
        <div>
            <LaporanTable
                // isExpandable={true}
                // renderSubComponent={DropdownLaporanRow}
                data={data}
                columns={columnLapPelunasanKomisi}
            />
        </div>
    );
}