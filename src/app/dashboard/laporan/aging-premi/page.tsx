'use client';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import LaporanFilter from "@/components/LaporanFilter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import getLapAgingPremiData from "@/features/laporan/aging-premi/actions/getLapAgingPremiData";
import LaporanAgingPremiTable from "@/features/laporan/aging-premi/LaporanAgingPremiTable";
import { LaporanAgingPremiRow } from "@/lib/laporan/laporan-aging-premi/types";
import PDFPreviewDialog from "@/components/PDFPreviewDialog";
import ExcelPreviewDialog from "@/components/ExcelPreviewDialog";
import { reports } from "@/lib/laporan/laporan-options";
import useLapAgingPremiDownload from "@/features/laporan/aging-premi/actions/useLapAgingPremiDownload";
import { excelColumnParser } from "@/lib/utils/excelColumnParser";


export default function Page() {
    const params = useSearchParams();
    const [paginatedRowData, setPaginatedRowData] = useState<LaporanAgingPremiRow[]>([]);
    const [exportRowData, setExportRowData] = useState<LaporanAgingPremiRow[]>([]);
    const [pageCount, setPageCount] = useState(0);

    const search = params?.get('search') ?? "";
    const page = Number(params?.get('page') ?? 1);
    const size = Number(params?.get('size') ?? 10);
    const startDate = params?.get('date_from') ?? "";
    const endDate = params?.get('date_to') ?? "";

    const reportConfig = reports.find((report) => report.id === "aging-premi");

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

    const prepareDataForExport = async () => {
        const res = await getLapAgingPremiData({
            searchParams: { search, page: 1, size: 5000, date_from: startDate, date_to: endDate, status: null },
        });
        if (res.success) {
            setExportRowData(res.data?.rows ?? []);
            return true;
        } else {
            console.error("Failed to fetch data for export:", res.message);
            setExportRowData([]);
            return false;
        }
    };

    const excelColumns = excelColumnParser<LaporanAgingPremiRow>(reportConfig?.columns);

    useEffect(() => {
        getLapAgingPremiData({
            searchParams: { search, page, size, date_from: startDate, date_to: endDate, status: null }
        }).then((data) => {
            if (data.success) {
                setPaginatedRowData(data.data?.rows ?? []);
                setPageCount(Math.ceil((data.data?.total_count ?? 0) / size));
            } else {
                console.error(data.message);
            }
        }).catch(error => {
            console.error("Failed to fetch aging premi data:", error);
        });
    }, [search, page, size, startDate, endDate]);

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