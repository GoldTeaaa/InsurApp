'use client';
import LaporanProduksiTable from "@/features/laporan/produksi/LaporanProduksiTable";
import getLaporanProduksiData from "@/features/laporan/produksi/actions/getLaporanProduksiData";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import DateFilter from "@/components/DateFilter";
import ExportOptions from "@/components/ExportOptions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import { generateProduksiPDF } from "@/features/laporan/produksi/actions/produksi-pdf-generator";
import PDFPreviewDialog from "@/components/PDFPreviewDialog";
import { formatDate } from "@/lib/utils/formatDate";

export default function Page() {
    const params = useSearchParams();
    const [rowData, setRowData] = useState<LaporanProduksiRow[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [pdfPreview, setPdfPreview] = useState({ isOpen: false, dataUrl: "" });

    const search = params?.get('search') ?? "";
    const page = Number(params?.get('page') ?? 1);
    const size = Number(params?.get('size') ?? 10);
    const startDate = params?.get('date_from') ?? "";
    const endDate = params?.get('date_to') ?? "";

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
                throw new Error(data.message);
            }
        })
    }, [search, page, size, startDate, endDate]);

    const handlePDFPreview = () => {
        if (rowData.length === 0) {
            // Optionally, show a notification that there is no data to export
            console.log("No data to generate PDF.");
            return;
        }
        const dataUrl = generateProduksiPDF(rowData, startDate, endDate);
        setPdfPreview({ isOpen: true, dataUrl });
    }

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

    return (
        <div>
            <Search
                placeholder="Cari nomor-polis / nama / asuransi"
                search={search}
            />
            <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                <DateFilter />
                <ExportOptions
                    onPDFExport={handlePDFPreview}
                    onExcelExport={() => { /* TODO */ }}
                />
            </div>
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
                    onClose={() => setPdfPreview({ isOpen: false, dataUrl: "" })}
                    onDownload={handlePDFDownload}
                    pdfDataUrl={pdfPreview.dataUrl}
                    title="Preview Laporan Produksi"
                />
            </div>
        </div>
    );
}