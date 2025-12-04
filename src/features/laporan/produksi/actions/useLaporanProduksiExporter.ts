import { useState } from 'react';
import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import { generateProduksiPDF } from "@/features/laporan/produksi/actions/produksi-pdf-generator";
import { formatDate } from "@/lib/utils/formatDate";
import { generateProduksiExcel } from "./produksi-excel-generator";
import triggerDownload from '@/lib/utils/triggerDownload';

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
  const [pdfPreview, setPdfPreview] = useState({ isOpen: false, dataUrl: "" });
  const [isExcelPreviewOpen, setIsExcelPreviewOpen] = useState(false);

  const handlePDFPreview = () => {
    if (rowData.length === 0) {
      console.log("No data to generate PDF.");
      // In a real app, you might use a toast notification here.
      return;
    }
    const dataUrl = generateProduksiPDF(rowData, startDate, endDate);
    setPdfPreview({ isOpen: true, dataUrl });
  };

  const handlePDFDownload = () => {
    const datePart =
      startDate && endDate
        ? `${formatDate(startDate)}_to_${formatDate(endDate)}`
        : "all_time";
    const fileName = `Laporan_Produksi_${datePart}.pdf`;
    const link = document.createElement("a");
    link.href = pdfPreview.dataUrl;
    link.download = fileName;
    link.click();
  };

  const closePDFPreview = () => {
    setPdfPreview({ isOpen: false, dataUrl: "" });
  };

//   EXCEL START HERE

  const handleExcelPreview = () => {
    if (rowData.length === 0) {
      console.log("No data to preview.");
      return;
    }
    setIsExcelPreviewOpen(true);
  };

  const closeExcelPreview = () => {
    setIsExcelPreviewOpen(false);
  };

  const handleExcelExport = async () => {
    if (rowData.length === 0) {
      console.log("No data to generate Excel file.");
      return;
    }

    const excelBlob = await generateProduksiExcel(rowData, startDate, endDate);
    const dataUrl = URL.createObjectURL(excelBlob);
    const datePart =
      startDate && endDate
        ? `${formatDate(startDate)}_to_${formatDate(endDate)}`
        : "all_time";
    const fileName = `Laporan_Produksi_${datePart}.xlsx`;

    triggerDownload(dataUrl, fileName);
    closeExcelPreview(); // Close dialog after download starts
  };

  return {
    pdfPreview,
    handlePDFPreview,
    handlePDFDownload,
    closePDFPreview,
    isExcelPreviewOpen,
    handleExcelPreview,
    closeExcelPreview,
    handleExcelExport,
  };
}
