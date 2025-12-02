import { LaporanAgingPremiRow } from "@/lib/laporan/laporan-aging-premi/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate, formatDateRange } from "../../../../lib/utils/formatDate";

const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });
};

export function generateAgingPremiPDF(
    laporanData: LaporanAgingPremiRow[],
    startDate?: string,
    endDate?: string
) {
    const doc = new jsPDF({
        orientation: "landscape",
    });
    let no = 1;

    // Add Title
    doc.setFontSize(16);
    doc.text("Laporan Aging Premi", 14, 22);
    if (startDate && endDate) {
        doc.setFontSize(10);
        doc.text(`Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`, 14, 28);
    }

    // Define table columns
    const head = [
        [
            'No',
            'No. Polis',
            'Nama Tertanggung',
            'Periode Polis',
            'Jenis Bisnis',
            'Premi Gross',
            'Discount',
            'Biaya Admin',
            'Premi Net',
            'Asuransi',
            'Jenis COAS',
            'Share',
            'Aging',
            'Amount Due',
            'Amount Paid',
            'Status',
        ],
    ];

    // Map data to table body
    const body = laporanData.map(row => [
        no++,
        row.nomor_polis,
        row.nama_tertanggung,
        formatDateRange(row.periode_mulai, row.periode_akhir),
        row.jenis_bisnis,
        formatCurrency(row.premi_gross),
        formatCurrency(row.discount),
        formatCurrency(row.biaya_admin_materai),
        formatCurrency(row.premi_net),
        row.nama_perusahaan_asuransi,
        row.jenis_coas,
        `${row.share}%`,
        row.aging_bracket,
        formatCurrency(row.amount_due),
        formatCurrency(row.amount_paid),
        row.detail_premi_status ?? 'N/A',
    ]);

    // Calculate totals for the footer
    const totalPremiGross = laporanData.reduce((sum, row) => sum + row.premi_gross, 0);
    const totalDiscount = laporanData.reduce((sum, row) => sum + row.discount, 0);
    const totalBiayaAdmin = laporanData.reduce((sum, row) => sum + row.biaya_admin_materai, 0);
    const totalPremiNet = laporanData.reduce((sum, row) => sum + row.premi_net, 0);
    const totalAmountDue = laporanData.reduce((sum, row) => sum + (row.amount_due ?? 0), 0);
    const totalAmountPaid = laporanData.reduce((sum, row) => sum + (row.amount_paid ?? 0), 0);

    // Create the table
    autoTable(doc, {
        head: head,
        body: body,
        startY: startDate && endDate ? 32 : 30,
        theme: 'grid',
        headStyles: {
            fillColor: [41, 128, 185], // A nice blue color for the header
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 7,
        },
        foot: [ // Add footer with totals
            [
                { content: 'Total', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalPremiGross), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalDiscount), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalBiayaAdmin), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalPremiNet), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: '', colSpan: 3 }, // Asuransi, Jenis COAS, Share
                { content: '' }, // Aging
                { content: formatCurrency(totalAmountDue), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalAmountPaid), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: '' }, // Status
            ]
        ],
        footStyles: {
            fillColor: [236, 240, 241], // A light grey for the footer
            textColor: [44, 62, 80],
            fontStyle: 'bold',
        },
        didDrawPage: (data) => {
            // Add page numbers
            const pageCount = doc.getNumberOfPages();
            doc.setFontSize(10);
            doc.text(
                `Page ${doc.internal.pages.length - 1} of ${pageCount}`,
                data.settings.margin.left,
                doc.internal.pageSize.height - 10
            );
            // Add generation date
            doc.text(
                `Tanggal Pembuatan: ${new Date().toLocaleDateString('id-ID')}`,
                doc.internal.pageSize.width - data.settings.margin.right,
                doc.internal.pageSize.height - 10,
                { align: 'right' }
            );
        },
        styles: {
            fontSize: 7,
            cellPadding: 1.5,
        },
    });

    return doc.output('datauristring');
}