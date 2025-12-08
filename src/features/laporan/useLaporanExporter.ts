import { useState } from 'react';
import { formatDate } from "@/lib/utils/formatDate";
import triggerDownload from '@/lib/utils/triggerDownload';

interface ExporterProps<T> {
  /** The data for the report. */
  rowData: T[];
  /** The start date for the report period. */
  startDate: string;
  /** The end date for the report period. */
  endDate: string;
  /** The base name for the exported files (e.g., "Laporan_Produksi"). */
  fileNamePrefix: string;
  /** A function that generates the PDF data URL. */
  pdfGenerator: (data: T[], startDate: string, endDate: string) => string;
  /** A function that generates the Excel file Blob. */
  excelGenerator: (data: T[], startDate: string, endDate: string) => Promise<Blob>;
}

/**
 * A generic hook for handling PDF/Excel preview and export logic for reports.
 */
export default function useLaporanExporter<T>({
  rowData,
  startDate,
  endDate,
  fileNamePrefix,
  pdfGenerator,
  excelGenerator,
}: ExporterProps<T>) {
  const [pdfPreview, setPdfPreview] = useState({ isOpen: false, dataUrl: "" });
  const [isExcelPreviewOpen, setIsExcelPreviewOpen] = useState(false);

  const handlePDFPreview = () => {
    if (rowData.length === 0) {
      console.log("No data to generate PDF.");
      // In a real app, you might use a toast notification here.
      return;
    }
    const dataUrl = pdfGenerator(rowData, startDate, endDate);
    setPdfPreview({ isOpen: true, dataUrl });
  };

  const handlePDFDownload = () => {
    const datePart =
      startDate && endDate
        ? `${formatDate(startDate)}_to_${formatDate(endDate)}`
        : "all_time";
    const fileName = `${fileNamePrefix}_${datePart}.pdf`;
    triggerDownload(pdfPreview.dataUrl, fileName);
  };

  const closePDFPreview = () => {
    setPdfPreview({ isOpen: false, dataUrl: "" });
  };

  // =================================================================================
  //                                  Excel Generation
  // =================================================================================
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

    const excelBlob = await excelGenerator(rowData, startDate, endDate);
    const dataUrl = URL.createObjectURL(excelBlob);
    const datePart =
      startDate && endDate
        ? `${formatDate(startDate)}_to_${formatDate(endDate)}`
        : "all_time";
    const fileName = `${fileNamePrefix}_${datePart}.xlsx`;

    triggerDownload(dataUrl, fileName);
    URL.revokeObjectURL(dataUrl); // Clean up the object URL
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