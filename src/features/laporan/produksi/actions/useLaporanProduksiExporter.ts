import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import { generateProduksiPDF } from "@/features/laporan/produksi/actions/produksi-pdf-generator";
import { generateProduksiExcel } from "./produksi-excel-generator";
import useLaporanExporter from '../../useLaporanExporter';

interface ExporterProps {
  rowData: LaporanProduksiRow[];
  startDate: string;
  endDate: string;
}
export default function useLaporanProduksiExporter({
  rowData,
  startDate,
  endDate,
}: ExporterProps) {
  return useLaporanExporter<LaporanProduksiRow>({
    rowData,
    startDate,
    endDate,
    fileNamePrefix: "Laporan_Produksi",
    pdfGenerator: generateProduksiPDF,
    excelGenerator: generateProduksiExcel,
  });
}
