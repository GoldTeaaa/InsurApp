'use client';

import LaporanFilter from "@/components/LaporanFilter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import LaporanAgingPremiTable from "@/features/laporan/aging-premi/LaporanAgingPremiTable";
import { LaporanAgingPremiRow } from "@/lib/laporan/laporan-aging-premi/types";
import PDFPreviewDialog from "@/components/PDFPreviewDialog";
import ExcelPreviewDialog from "@/components/ExcelPreviewDialog";
import { reportsConfig } from "@/lib/laporan/laporan-options";
import { excelColumnParser } from "@/lib/utils/excelColumnParser";
import getLapAgingPremiData from "@/features/laporan/aging-premi/actions/getLapAgingPremiData";
import useLapAgingPremiDownload from "@/features/laporan/aging-premi/actions/useLapAgingPremiDownload";
import { useLaporanData } from "@/features/laporan/useLaporanData";

export default function Page() {
    const {
        paginatedRowData,
        exportRowData,
        pageCount,
        search, page, startDate, endDate,
        prepareDataForExport
    } = useLaporanData<LaporanAgingPremiRow>({ fetcher: getLapAgingPremiData });

    const {
        pdfPreview,
        handlePDFPreview,
        handlePDFDownload,
        closePDFPreview,
        isExcelPreviewOpen,
        handleExcelPreview,
        closeExcelPreview,
        handleExcelExport,
    } = useLapAgingPremiDownload({
        rowData: exportRowData,
        startDate,
        endDate
    });

    // Directly access the strongly-typed config, no .find() needed.
    const reportConfig = reportsConfig["aging-premi"];

    const excelColumns = excelColumnParser(reportConfig.columns);

    return (
        <div>
            <Search
                placeholder="Cari nomor-polis / nama / asuransi"
                search={search}
            />
            <LaporanFilter
                handlePDFPreview={async () => {
                    if (await prepareDataForExport()) {
                        handlePDFPreview();
                    }
                }}
                handleExcelPreview={async () => {
                    if (await prepareDataForExport()) {
                        handleExcelPreview();
                    }
                }}
            />
            <LaporanAgingPremiTable
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
                    title="Preview Laporan Aging Premi"
                />
                <ExcelPreviewDialog<LaporanAgingPremiRow>
                    isOpen={isExcelPreviewOpen}
                    onClose={closeExcelPreview}
                    onDownload={handleExcelExport}
                    title="Preview Laporan Aging Premi (Excel)"
                    data={exportRowData}
                    columns={excelColumns}
                />
            </div>
        </div>
    );
}