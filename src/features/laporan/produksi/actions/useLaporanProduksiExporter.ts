import { useState } from 'react';
import { LaporanProduksiRow } from '@/lib/laporan/laporan-produksi/types';
import { generateProduksiPDF } from '@/features/laporan/produksi/actions/produksi-pdf-generator';
import { formatDate } from '@/lib/utils/formatDate';

interface ExporterProps {
    rowData: LaporanProduksiRow[];
    startDate: string;
    endDate: string;
}

export default function useLaporanExporter({ rowData, startDate, endDate }: ExporterProps) {
    const [pdfPreview, setPdfPreview] = useState({ isOpen: false, dataUrl: "" });

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
        const datePart = startDate && endDate
            ? `${formatDate(startDate)}_to_${formatDate(endDate)}`
            : 'all_time';
        const fileName = `Laporan_Produksi_${datePart}.pdf`;
        const link = document.createElement('a');
        link.href = pdfPreview.dataUrl;
        link.download = fileName;
        link.click();
    };

    const closePDFPreview = () => {
        setPdfPreview({ isOpen: false, dataUrl: "" });
    };

    // When you add Excel logic, you can add handleExcelExport here.
    const handleExcelExport = () => {
        console.log("Excel export not implemented yet.");
        // const excelBlob = generateProduksiExcel(rowData, startDate, endDate);
        // ... download logic for blob
    };

    return { pdfPreview, handlePDFPreview, handlePDFDownload, closePDFPreview, handleExcelExport };
}