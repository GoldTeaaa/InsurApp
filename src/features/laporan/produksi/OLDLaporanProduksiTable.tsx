'use client';

import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import LaporanTable from "@/features/laporan/LaporanTable";
import { columnLaporanProduksi } from "@/features/laporan/produksi/columnLapProduksi";
import DropdownLaporanRow from "./DropdownLaporanProduksiRow";
import { Suspense } from "react";

type laporanProduksiTableProps = {
    data: LaporanProduksiRow[]
}

export default function LaporanProduksiTable({
    data
}: laporanProduksiTableProps) {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <LaporanTable
                    isExpandable={true}
                    renderSubComponent={DropdownLaporanRow}
                    data={data}
                    columns={columnLaporanProduksi}
                />
            </Suspense>
        </div>
    );
}