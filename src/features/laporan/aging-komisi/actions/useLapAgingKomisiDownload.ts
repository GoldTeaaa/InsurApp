import { useState } from 'react';
import { LaporanAgingKomisiItem } from "@/lib/laporan/laporan-aging-komisi/types";
import { formatDate } from "@/lib/utils/formatDate";
import triggerDownload from '@/lib/utils/triggerDownload';
import { generateAgingKomisiExcel } from './aging-komisi-excel-generator';
import { generateAgingKomisiPDF } from './pdf-aging-komisi-generator';

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
  const [pdfPreview, setPdfPreview] = useState({ isOpen: false, dataUrl: "" });
  const [isExcelPreviewOpen, setIsExcelPreviewOpen] = useState(false);

  const handlePDFPreview = () => {
    if (rowData.length === 0) {
      console.log("No data to generate PDF.");
      // In a real app, you might use a toast notification here.
      return;
    }
    const dataUrl = generateAgingKomisiPDF(rowData, startDate, endDate);
    setPdfPreview({ isOpen: true, dataUrl });
  };

  const handlePDFDownload = () => {
    const datePart =
      startDate && endDate
        ? `${formatDate(startDate)}_to_${formatDate(endDate)}`
        : "all_time";
    const fileName = `Laporan_Aging_Komisi_${datePart}.pdf`.replace(/ /g, '_');
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

    const excelBlob = await generateAgingKomisiExcel(rowData, startDate, endDate);
    const dataUrl = URL.createObjectURL(excelBlob);
    const datePart =
      startDate && endDate
        ? `${formatDate(startDate)}_to_${formatDate(endDate)}`
        : "all_time";
    const fileName = `Laporan_Aging_Komisi_${datePart}.xlsx`;

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