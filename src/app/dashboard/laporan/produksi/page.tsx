'use client';
import LaporanProduksiTable from "@/features/laporan/produksi/LaporanProduksiTable";
import getLaporanProduksiData from "@/features/laporan/produksi/actions/getLaporanProduksiData";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import PDFPreviewDialog from "@/components/PDFPreviewDialog";
import LaporanFilter from "@/components/LaporanFilter";
import useLaporanProduksiExporter from "@/features/laporan/produksi/actions/useLaporanProduksiExporter";
import ExcelPreviewDialog from "@/components/ExcelPreviewDialog";
import { reports } from "@/lib/laporan/laporan-options";
import { excelColumnParser } from "@/lib/utils/excelColumnParser";

// Can't use searchParams because need to have onClick event for download
export default function Page() {
    const params = useSearchParams();
    const [paginatedRowData, setPaginatedRowData] = useState<LaporanProduksiRow[]>([]);
    const [exportRowData, setExportRowData] = useState<LaporanProduksiRow[]>([]);
    const [pageCount, setPageCount] = useState(0);

    const search = params?.get('search') ?? "";
    const page = Number(params?.get('page') ?? 1);
    const size = Number(params?.get('size') ?? 10);
    const startDate = params?.get('date_from') ?? "";
    const endDate = params?.get('date_to') ?? "";

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

    const prepareDataForExport = async () => {
        const res = await getLaporanProduksiData({
            searchParams: {
                search,
                page: 1,
                size: 5000, // Use a large number to get all data
                date_from: startDate,
                date_to: endDate,
                status: null,
            },
        });
        if (res.success) {
            setExportRowData(res.data?.rows ?? []);
            return true; // Indicate success
        } else {
            console.error("Failed to fetch data for export:", res.message);
            setExportRowData([]);
            return false; // Indicate failure
        }
    };

    useEffect(() => {
        getLaporanProduksiData({
            searchParams: {
                search,
                page,
                size,
                date_from: startDate,
                date_to: endDate,
                status: null // for now set to null
            }
        }).then((data) => {
            if (data.success) {
                setPaginatedRowData(data.data?.rows ?? []);
                setPageCount(Math.ceil((data.data?.total_count ?? 0) / size));
            } else {
                console.error(data.message);
            }
        })
            .catch(error => { // Handle promise rejection (e.g., network error)
                console.error("Failed to fetch laporan produksi data:", error);
            });
    }, [search, page, size, startDate, endDate]);

    const report = reports.find((report) => {
        return report.id === "produksi";
    })

    // console.log("report: ", report);
    // console.log('report columns: ', report?.columns);

    // Use the generic parser to generate columns
    const excelColumns = excelColumnParser<LaporanProduksiRow>(report?.columns ?? []);

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