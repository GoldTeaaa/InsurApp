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

// Can't use searchParams because need to have onClick event for download
export default function Page() {
    const params = useSearchParams();
    const [rowData, setRowData] = useState<LaporanProduksiRow[]>([]);
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
        handleExcelExport
    } = useLaporanProduksiExporter({ rowData, startDate, endDate });

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
                setRowData(data.data?.rows ?? []);
                setPageCount(Math.ceil((data.data?.total_count ?? 0) / size));
            } else {
                console.error(data.message);
            }
        })
        .catch(error => { // Handle promise rejection (e.g., network error)
            console.error("Failed to fetch laporan produksi data:", error);
        });
    }, [search, page, size, startDate, endDate, setRowData, setPageCount]);

    return (
        <div>
            <Search
                placeholder="Cari nomor-polis / nama / asuransi"
                search={search}
            />
            <LaporanFilter 
                handlePDFPreview={handlePDFPreview}
                handleExcelPreview={handleExcelExport}
            />
            <LaporanProduksiTable
                data={rowData}
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
            </div>
        </div>
    );
}