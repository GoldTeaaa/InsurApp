import { LaporanPelunasanKomisiRow } from "@/lib/laporan/laporan-pelunasan-komisi/types";
import useLaporanExporter from "../../useLaporanExporter";
import generatePelunasanKomisiExcel from "./exportExcelPelunasanKomisi";
import generatePelunasanKomisiPDF from "./exportPdfPelunasanKomisi";

interface ExporterProps {
  rowData: LaporanPelunasanKomisiRow[];
  startDate: string;
  endDate: string;
}

export default function useLapPelunasanKomisiExport({
    rowData,
    startDate,
    endDate
}: ExporterProps) {
    return useLaporanExporter<LaporanPelunasanKomisiRow>({
        rowData,
        startDate,
        endDate,
        fileNamePrefix: "Laporan_Pelunasan_Komisi",
        pdfGenerator: generatePelunasanKomisiPDF,
        excelGenerator: generatePelunasanKomisiExcel
    })
}