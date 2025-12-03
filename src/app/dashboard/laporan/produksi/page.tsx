'use client';
import LaporanProduksiTable from "@/features/laporan/produksi/LaporanProduksiTable";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import PDFPreviewDialog from "@/components/PDFPreviewDialog";
import LaporanFilter from "@/components/LaporanFilter";
import ExcelPreviewDialog from "@/components/ExcelPreviewDialog";
import { reportsConfig } from "@/lib/laporan/laporan-options";
import { excelColumnParser } from "@/lib/utils/excelColumnParser";
import getLaporanProduksiData from "@/features/laporan/produksi/actions/getLaporanProduksiData";
import useLaporanProduksiExporter from "@/features/laporan/produksi/actions/useLaporanProduksiExporter";
import { useLaporan } from "@/features/laporan/useLaporan";

// Can't use searchParams because need to have onClick event for download
export default function Page() {
    const {
        paginatedRowData,
        exportRowData,
        pageCount,
        search, page, startDate, endDate,
        prepareDataForExport
    } = useLaporan<LaporanProduksiRow>({ fetcher: getLaporanProduksiData });

    const {
        pdfPreview,
        handlePDFPreview,
        handlePDFDownload,
        closePDFPreview,
        isExcelPreviewOpen,
        handleExcelPreview,
        closeExcelPreview,
        handleExcelExport,
    } = useLaporanProduksiExporter({ rowData: exportRowData, startDate, endDate });

    const reportConfig = reportsConfig["produksi"];

    // Use the generic parser to generate columns
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
            <LaporanProduksiTable
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
                    title="Preview Laporan Produksi"
                />
                <ExcelPreviewDialog<LaporanProduksiRow>
                    isOpen={isExcelPreviewOpen}
                    onClose={closeExcelPreview}
                    onDownload={handleExcelExport}
                    title="Preview Laporan Produksi (Excel)"
                    data={exportRowData}
                    columns={excelColumns ?? []}
                />
            </div>
        </div>
    );
}