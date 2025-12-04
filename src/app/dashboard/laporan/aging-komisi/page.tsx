'use client';
import LaporanFilter from "@/components/LaporanFilter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import LaporanAgingKomisiTable from "@/features/laporan/aging-komisi/LaporanAgingKomisiTable";
import { LaporanAgingKomisiItem } from "@/lib/laporan/laporan-aging-komisi/types";
import PDFPreviewDialog from "@/components/PDFPreviewDialog";
import ExcelPreviewDialog from "@/components/ExcelPreviewDialog";
import { reportsConfig } from "@/lib/laporan/laporan-options";
import { excelColumnParser } from "@/lib/utils/excelColumnParser";
import getLapAgingKomisiData from "@/features/laporan/aging-komisi/actions/getLapAgingKomisiData";
import useLapAgingKomisiDownload from "@/features/laporan/aging-komisi/actions/useLapAgingKomisiDownload";
import { useLaporan } from "@/features/laporan/useLaporan";

export default function Page() {
    const {
        paginatedRowData,
        exportRowData,
        pageCount,
        search, page, startDate, endDate,
        prepareDataForExport
    } = useLaporan<LaporanAgingKomisiItem>({ fetcher: getLapAgingKomisiData });

    const {
        pdfPreview,
        handlePDFPreview,
        handlePDFDownload,
        closePDFPreview,
        isExcelPreviewOpen,
        handleExcelPreview,
        closeExcelPreview,
        handleExcelExport,
    } = useLapAgingKomisiDownload({
        rowData: exportRowData,
        startDate,
        endDate
    });

    // Assuming 'aging-komisi' is a key in reportsConfig
    const reportConfig = reportsConfig["aging-komisi"];

    const excelColumns = excelColumnParser(reportConfig.columns);

    return (
        <div>
            <Search
                placeholder="Cari nomor-polis / nama / asuransi"
                search={search}
            />
            <LaporanFilter
                handlePDFPreview={async () => { if (await prepareDataForExport()) { handlePDFPreview(); } }}
                handleExcelPreview={async () => { if (await prepareDataForExport()) { handleExcelPreview(); } }}
            />
            <LaporanAgingKomisiTable
                data={paginatedRowData}
            />
            <Pagination
                page={page}
                pageCount={pageCount}
            />
            <div>
                <PDFPreviewDialog
                    isOpen={pdfPreview.isOpen}
                    onClose={closePDFPreview}
                    onDownload={handlePDFDownload}
                    pdfDataUrl={pdfPreview.dataUrl}
                    title="Preview Laporan Aging Komisi"
                />
                <ExcelPreviewDialog<LaporanAgingKomisiItem>
                    isOpen={isExcelPreviewOpen}
                    onClose={closeExcelPreview}
                    onDownload={handleExcelExport}
                    title="Preview Laporan Aging Komisi (Excel)"
                    data={exportRowData}
                    columns={excelColumns}
                />
            </div>
        </div>
    );
}