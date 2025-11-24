'use client';
import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import { generateProduksiPDF } from "@/features/laporan/produksi/actions/produksi-pdf-generator";

type Props = {
    laporanData: LaporanProduksiRow[];
    startDate?: string;
    endDate?: string;
}

export default function ExportOptions({
    laporanData,
    startDate,
    endDate
}: Props) {

    const handlePDFExport = () => {
        console.log("Generating PDF for:", laporanData);
        generateProduksiPDF(laporanData, startDate, endDate);
    };

    const handleExcelExport = () => {
        // TODO: Implement Excel export logic
    };

    return (
        <div className="flex gap-2">
            <Button variant="destructive" onClick={handlePDFExport}>
                <Download className="w-4 h-4 mr-2" />
                PDF
            </Button>
            <Button className="bg-green-700 hover:bg-green-800" onClick={handleExcelExport}>
                <Download className="w-4 h-4 mr-2 " />
                Excel
            </Button>
        </div>
    );
}