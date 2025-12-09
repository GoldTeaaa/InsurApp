import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import { Suspense } from "react";
import LaporanTable from "../LaporanTable";
import { columnLapProduksi } from "./columnLapProduksi";

type laporanProduksiTableProps = {
    data: LaporanProduksiRow[]
}

export default function LapProduksiTable({
    data
}: laporanProduksiTableProps) {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LaporanTable
                data={data}
                columns={columnLapProduksi}
                leftPin={["nomor_polis", "nama_tertanggung", "periode", "jenis_bisnis"]}
            />
        </Suspense>
    );
}