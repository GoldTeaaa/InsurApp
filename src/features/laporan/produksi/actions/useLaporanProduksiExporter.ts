import { LaporanProduksiRow, LaporanProduksiTable } from "@/lib/laporan/laporan-produksi/types";
import { generateProduksiPDF } from "@/features/laporan/produksi/actions/produksi-pdf-generator";
import { generateProduksiExcel } from "./produksi-excel-generator";
import useLaporanExporter from '@/features/laporan/useLaporanExporter';
import TransformProduksiData from "@/features/laporan/produksi/actions/transform-produksi-data";

interface ExporterProps {
  rowData: LaporanProduksiTable;
  startDate: string;
  endDate: string;
}
export default function useLaporanProduksiExporter({
  rowData,
  startDate,
  endDate,
}: ExporterProps) {
  // To tell the typescript inside the useLaporanExporter
  // that the rowData is an array, we need to use the single
  // LaporanProduksiRow type and can't use the LaporanProduksiTable
  // const transformedData = TransformProduksiData(rowData);

  return useLaporanExporter<LaporanProduksiRow>({
    rowData,
    startDate,
    endDate,
    fileNamePrefix: "Laporan_Produksi",
    pdfGenerator: generateProduksiPDF,
    excelGenerator: generateProduksiExcel,
  });
}
