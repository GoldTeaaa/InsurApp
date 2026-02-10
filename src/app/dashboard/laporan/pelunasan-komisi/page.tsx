'use client';
import ExcelPreviewDialog from "@/components/ExcelPreviewDialog";
import LaporanFilter from "@/components/LaporanFilter";
import Pagination from "@/components/table/Pagination";
import PDFPreviewDialog from "@/components/PDFPreviewDialog";
import Search from "@/components/Search";
import getPelunasanKomisiData from "@/features/laporan/pelunasan-komisi/actions/getPelunasanKomisiData";
import useLapPelunasanKomisiExport from "@/features/laporan/pelunasan-komisi/actions/useLapPelunasanKomisiExport";
import PelunasanKomisiTable from "@/features/laporan/pelunasan-komisi/PelunasanKomisiTable";
import { useLaporanData } from "@/features/laporan/useLaporanData";
import { reportsConfig } from "@/lib/laporan/laporan-options";
import { LaporanPelunasanKomisiRow } from "@/lib/laporan/laporan-pelunasan-komisi/types";
import { excelColumnParser } from "@/lib/utils/excelColumnParser";

export default function Page() {

    const {
        paginatedRowData,
        exportRowData,
        pageCount,
        search, page, startDate, endDate,
        prepareDataForExport
    } = useLaporanData<LaporanPelunasanKomisiRow>({
        fetcher: getPelunasanKomisiData,
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
    } = useLapPelunasanKomisiExport({
        rowData: exportRowData,
        startDate,
        endDate
    });
    
    const reportConfig = reportsConfig['pelunasan-komisi'];

    const excelColumns = excelColumnParser<LaporanPelunasanKomisiRow>(reportConfig.columns)

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
            <PelunasanKomisiTable
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
                <ExcelPreviewDialog<LaporanPelunasanKomisiRow>
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