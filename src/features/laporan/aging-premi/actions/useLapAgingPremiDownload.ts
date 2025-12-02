import { useState } from 'react';
import { LaporanAgingPremiRow } from "@/lib/laporan/laporan-aging-premi/types";
import { generateAgingPremiPDF } from "@/features/laporan/aging-premi/actions/pdf-aging-premi-generator";
import { formatDate } from "@/lib/utils/formatDate";

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
  const [pdfPreview, setPdfPreview] = useState({ isOpen: false, dataUrl: "" });
  const [isExcelPreviewOpen, setIsExcelPreviewOpen] = useState(false);

  const handlePDFPreview = () => {
    if (rowData.length === 0) {
      console.log("No data to generate PDF.");
      // In a real app, you might use a toast notification here.
      return;
    }
    const dataUrl = generateAgingPremiPDF(rowData, startDate, endDate);
    setPdfPreview({ isOpen: true, dataUrl });
  };

  const handlePDFDownload = () => {
    const datePart =
      startDate && endDate
        ? `${formatDate(startDate)}_to_${formatDate(endDate)}`
        : "all_time";
    const fileName = `Laporan_Aging_Premi_${datePart}.pdf`.replace(/ /g, '_');
    triggerDownload(pdfPreview.dataUrl, fileName);
  };

  const closePDFPreview = () => {
    setPdfPreview({ isOpen: false, dataUrl: "" });
  };

  // --- TODO: Implement Excel Generation ---
  const handleExcelPreview = () => {
    if (rowData.length === 0) {
      console.log("No data to preview.");
      return;
    }
    // setIsExcelPreviewOpen(true);
    console.log("Excel preview for Aging Premi is not yet implemented.");
  };

  const closeExcelPreview = () => {
    setIsExcelPreviewOpen(false);
  };

  const handleExcelExport = async () => {
    console.log("Excel export for Aging Premi is not yet implemented.");
    // const excelBlob = await generateAgingPremiExcel(rowData, startDate, endDate);
    // ... trigger download
  };

  function triggerDownload(url: string, fileName: string) {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the object URL
  }

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