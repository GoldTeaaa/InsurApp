'use client';

import { LaporanProduksiRow } from "@/lib/laporan/types";
import LaporanTable from "@/features/laporan/LaporanTable";
import { columnLaporanProduksi } from "@/lib/laporan/report-list/column-lap-produksi";
import DropdownLaporanRow from "./DropdownLaporanRow";

type laporanProduksiTableProps = {
    data: LaporanProduksiRow[]
}

export default function LaporanProduksiTable({
    data
}: laporanProduksiTableProps) {
    return (
        <div>
            <LaporanTable
                isExpandable={true}
                renderSubComponent={DropdownLaporanRow}
                data={data}
                columns={columnLaporanProduksi}
            />
        </div>
    );
}