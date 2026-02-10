'use client';
import ExcelPreviewDialog from "@/components/ExcelPreviewDialog";
import LaporanFilter from "@/components/LaporanFilter";
import Pagination from "@/components/table/Pagination";
import PDFPreviewDialog from "@/components/PDFPreviewDialog";
import getPelunasanPremiData from "@/features/laporan/pelunasan-premi/actions/getPelunasanPremiData";
import useLapPelunasanPremiExport from "@/features/laporan/pelunasan-premi/actions/useLapPelunasanPremiExport";
import PelunasanPremiTable from "@/features/laporan/pelunasan-premi/PelunasanPremiTable";
import Search from "@/components/Search";
import { useLaporanData } from "@/features/laporan/useLaporanData";
import { reportsConfig } from "@/lib/laporan/laporan-options";
import { PelunasanPremiRow } from "@/lib/laporan/laporan-pelunasan-premi/types";
import { excelColumnParser } from "@/lib/utils/excelColumnParser";

export default function Page() {

    const {
        paginatedRowData,
        exportRowData,
        pageCount,
        search, page, startDate, endDate,
        prepareDataForExport
    } = useLaporanData<PelunasanPremiRow>({
        fetcher: getPelunasanPremiData,
    });

    const {
        pdfPreview,
        handlePDFPreview,
        handlePDFDownload,
        closePDFPreview,
        isExcelPreviewOpen,
        handleExcelPreview,
        closeExcelPreview,
        handleExcelExport,
    } = useLapPelunasanPremiExport({
        rowData: exportRowData,
        startDate,
        endDate
    });

    const reportConfig = reportsConfig['pelunasan-premi'];
    const excelColumns = excelColumnParser<PelunasanPremiRow>(reportConfig.columns);

    return (
        <div>
            <Search
                placeholder="Cari nomor-polis / nama / asuransi"
                search={search}
            />
            <LaporanFilter
                handlePDFPreview={async () => {
                    if (await prepareDataForExport()) handlePDFPreview();
                }}
                handleExcelPreview={async () => {
                    if (await prepareDataForExport()) handleExcelPreview();
                }}
            />
            <PelunasanPremiTable
                data={paginatedRowData}
            />
            <Pagination
                page={page}
                pageCount={pageCount}
            />
            <PDFPreviewDialog
                isOpen={pdfPreview.isOpen}
                onClose={closePDFPreview}
                onDownload={handlePDFDownload}
                pdfDataUrl={pdfPreview.dataUrl}
                title="Preview Laporan Pelunasan Premi"
            />
            <ExcelPreviewDialog<PelunasanPremiRow>
                isOpen={isExcelPreviewOpen}
                onClose={closeExcelPreview}
                onDownload={handleExcelExport}
                title="Preview Laporan Pelunasan Premi (Excel)"
                data={exportRowData}
                columns={excelColumns}
            />
        </div>
    );
}