import { LaporanAgingKomisiItem } from "@/lib/laporan/laporan-aging-komisi/types";
import { generateAgingKomisiExcel } from './exportExcelAgingKomisi';
import { generateAgingKomisiPDF } from './exportPdfAgingKomisi';
import useLaporanExporter from '../../useLaporanExporter';

interface ExporterProps {
  rowData: LaporanAgingKomisiItem[];
  startDate: string;
  endDate: string;
}
export default function useLapAgingKomisiDownload({
  rowData,
  startDate,
  endDate,
}: ExporterProps) {
  return useLaporanExporter<LaporanAgingKomisiItem>({
    rowData,
    startDate,
    endDate,
    fileNamePrefix: "Laporan_Aging_Komisi",
    pdfGenerator: generateAgingKomisiPDF,
    excelGenerator: generateAgingKomisiExcel,
  });
}