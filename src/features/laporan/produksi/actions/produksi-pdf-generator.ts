import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "../../../../lib/utils/formatDate";

const formatCurrency = (value: number) => {
    return value.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });
};

export function generateProduksiPDF(
    laporanData: LaporanProduksiRow[],
    startDate?: string,
    endDate?: string
) {
    const doc = new jsPDF({
        orientation: "landscape",
    });

    // Add Title
    doc.setFontSize(16);
    doc.text("Laporan Produksi", 14, 22);
    if (startDate && endDate) {
        doc.setFontSize(10);
        doc.text(`Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`, 14, 28);
    }

    // Define table columns
    const head = [
        [
            'No. Polis',
            'Nama Tertanggung',
            'Periode Polis',
            'Jenis Bisnis',
            'Premi',
            'Discount',
            'Biaya Admin',
            'Premi Net',
            'No. Kwitansi',
            'Komisi',
            'PPH',
            'Komisi Net',
            'Asuransi',
            'Jenis COAS',
            'Share',
        ],
    ];

    // Map data to table body
    const body = laporanData.map(row => [
        row.nomor_polis,
        row.nama_tertanggung,
        `${formatDate(row.periode_mulai)} - ${formatDate(row.periode_akhir)}`,
        row.jenis_bisnis,
        formatCurrency(row.premi),
        formatCurrency(row.discount),
        formatCurrency(row.biaya_admin_materai),
        formatCurrency(row.premi_net),
        row.no_kwitansi_komisi,
        formatCurrency(row.komisi),
        formatCurrency(row.pph_komisi),
        formatCurrency(row.komisi_net),
        row.nama_perusahaan_asuransi,
        row.jenis_coas,
        `${row.share}%`,
    ]);

    // Calculate totals for the footer
    const totalPremi = laporanData.reduce((sum, row) => sum + row.premi, 0);
    const totalDiscount = laporanData.reduce((sum, row) => sum + row.discount, 0);
    const totalBiayaAdmin = laporanData.reduce((sum, row) => sum + row.biaya_admin_materai, 0);
    const totalPremiNet = laporanData.reduce((sum, row) => sum + row.premi_net, 0);
    const totalKomisi = laporanData.reduce((sum, row) => sum + row.komisi, 0);
    const totalPphKomisi = laporanData.reduce((sum, row) => sum + row.pph_komisi, 0);
    const totalKomisiNet = laporanData.reduce((sum, row) => sum + row.komisi_net, 0);

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
                { content: 'Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalPremi), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalDiscount), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalBiayaAdmin), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalPremiNet), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: '' }, // No total for kwitansi
                { content: formatCurrency(totalKomisi), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalPphKomisi), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalKomisiNet), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: '', colSpan: 3 },
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
                `Generated on: ${new Date().toLocaleDateString('id-ID')}`,
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

    // Save the PDF
    // const datePart = startDate && endDate
    //     ? `${formatDate(startDate)}_to_${formatDate(endDate)}`
    //     : 'all_time';
    //
    // const fileName = `Laporan_Produksi_${datePart}.pdf`;
    //
    // doc.save(fileName);

    return doc.output('datauristring');
}