
import { PelunasanPremiRow } from "@/lib/laporan/laporan-pelunasan-premi/types";
import useLaporanExporter from "../../useLaporanExporter";
import generatePelunasanPremiExcel from '@/features/laporan/pelunasan-premi/actions/excel-pelunasan-premi-generator';
import generatePelunasanPremiPDF from "@/features/laporan/pelunasan-premi/actions/pdf-pelunasan-premi-generator";

interface ExporterProps {
  rowData: PelunasanPremiRow[];
  startDate: string;
  endDate: string;
}

export default function useLapPelunasanPremiExport({
    rowData,
    startDate,
    endDate
}: ExporterProps) {
    return useLaporanExporter<PelunasanPremiRow>({
        rowData,
        startDate,
        endDate,
        fileNamePrefix: "Laporan_Pelunasan_Premi",
        pdfGenerator: generatePelunasanPremiPDF,
        excelGenerator: generatePelunasanPremiExcel
    })
}