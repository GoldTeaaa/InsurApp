import { LaporanAgingPremiRow } from "@/lib/laporan/laporan-aging-premi/types";
import { generateAgingPremiPDF } from "@/features/laporan/aging-premi/actions/pdf-aging-premi-generator";
import { generateAgingPremiExcel } from '@/features/laporan/aging-premi/actions/aging-premi-excel-generator';
import useLaporanExporter from '../../useLaporanExporter';

interface ExporterProps {
  rowData: LaporanAgingPremiRow[];
  startDate: string;
  endDate: string;
}

export default function useLapAgingPremiDownload({
  rowData,
  startDate,
  endDate,
}: ExporterProps) {
  return useLaporanExporter<LaporanAgingPremiRow>({
    rowData,
    startDate,
    endDate,
    fileNamePrefix: "Laporan_Aging_Premi",
    pdfGenerator: generateAgingPremiPDF,
    excelGenerator: generateAgingPremiExcel,
  });
}