import { PelunasanPremiRow } from "@/lib/laporan/laporan-pelunasan-premi/types";
import { convertIDR } from "@/lib/utils/convertIDR";
import { formatDate, formatDateRange } from "@/lib/utils/formatDate";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generatePelunasanPremiPDF(
    laporanData: PelunasanPremiRow[],
    startDate?: string,
    endDate?: string
) {
    const doc = new jsPDF({
        orientation: "landscape",
    });
    let no = 1;

    // Add Title
    doc.setFontSize(16);
    doc.text("Laporan Pelunasan Premi", 14, 22);
    if (startDate && endDate) {
        doc.setFontSize(10);
        doc.text(`Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`, 14, 28);
    }

    const head = [
        [
            "No",
            "Periode Polis",
            "No. Polis",
            "Nama Tertanggung",
            "Jenis Bisnis",
            "Premi Gross",
            "Discount",
            "Biaya Admin/Materai",
            "Premi Net",
            "Asuransi",
            "Keterangan",
            "Share",
            "Status",
            "Amount Paid",
            "Tanggal Bayar",
        ],
    ];

    const body = laporanData.map((row) => [
        no++,
        formatDateRange(row.periode_mulai, row.periode_akhir),
        row.nomor_polis,
        row.nama_tertanggung,
        row.bisnis,
        convertIDR(row.premi_gross),
        convertIDR(row.discount),
        convertIDR(row.biaya_admin_materai),
        convertIDR(row.premi_net),
        row.nama_perusahaan_asuransi,
        row.jenis_coas,
        `${row.share}%`,
        row.status,
        convertIDR(row.amount_paid),
        formatDate(row.tanggal_bayar),
    ]);

    // Calculate totals for the footer
    const totalPremiGross = laporanData.reduce((sum, row) => sum + row.premi_gross, 0);
    const totalDiscount = laporanData.reduce((sum, row) => sum + row.discount, 0);
    const totalBiayaAdmin = laporanData.reduce((sum, row) => sum + row.biaya_admin_materai, 0);
    const totalPremiNet = laporanData.reduce((sum, row) => sum + row.premi_net, 0);
    const totalAmountPaid = laporanData.reduce((sum, row) => sum + row.amount_paid, 0);

    autoTable(doc, {
        head: head,
        body: body,
        startY: startDate && endDate ? 32 : 30,
        theme: 'grid',
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 6,
            cellPadding: 1,
        },
        foot: [
            [
                { content: 'Total', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: convertIDR(totalPremiGross), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: convertIDR(totalDiscount), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: convertIDR(totalBiayaAdmin), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: convertIDR(totalPremiNet), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: '', colSpan: 4 }, // Spacer for Asuransi, Keterangan, Share, Status
                { content: convertIDR(totalAmountPaid), styles: { halign: 'right', fontStyle: 'bold' } },
            ]
        ],
        footStyles: {
            fillColor: [236, 240, 241],
            textColor: [44, 62, 80],
            fontStyle: 'bold',
            fontSize: 6,
        },
        columnStyles: {
            0: { cellWidth: 8 }, // No
            5: { halign: 'right' }, // Premi Gross
            6: { halign: 'right' }, // Discount
            7: { halign: 'right' }, // Biaya Admin
            8: { halign: 'right' }, // Premi Net
            11: { halign: 'right' }, // Share
            13: { halign: 'right' }, // Amount Paid
        },
        didDrawPage: (data) => {
            const pageCount = doc.getNumberOfPages();
            doc.setFontSize(10);
            doc.text(`Page ${doc.internal.pages.length - 1} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
            doc.text(`Tanggal Pembuatan: ${new Date().toLocaleDateString('id-ID')}`, doc.internal.pageSize.width - data.settings.margin.right, doc.internal.pageSize.height - 10, { align: 'right' });
        },
        styles: {
            fontSize: 6,
            cellPadding: 1,
        },
    });

    return doc.output('datauristring');
}