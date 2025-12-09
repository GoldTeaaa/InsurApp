import { LaporanAgingPremiRow } from "@/lib/laporan/laporan-aging-premi/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate, formatDateRange } from "../../../../lib/utils/formatDate";
import { AGING_RANGE } from "@/lib/types";
import { convertIDR } from "@/lib/utils/convertIDR";

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

    // Define table columns. jspdf-autotable expects the head to be an array of rows.
    // Since we only have one header row, it's an array containing a single array of strings.
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
            ...AGING_RANGE, // Spread to create individual columns: '0-30', '31-60', etc.
        ],
    ];

    // Map data to table body
    const body = laporanData.map((row) => {
        // Create an array for the aging values based on the row's bracket
        const agingValues = AGING_RANGE.map((range) =>
            row.aging_bracket === range ? convertIDR(row.amount_due) : "-"
        );

        return [
            no++,
            formatDateRange(row.periode_mulai, row.periode_akhir),
            row.nomor_polis,
            row.nama_tertanggung,
            row.jenis_bisnis,
            convertIDR(row.premi_gross),
            convertIDR(row.discount),
            convertIDR(row.biaya_admin_materai),
            convertIDR(row.premi_net),
            row.nama_perusahaan_asuransi,
            row.jenis_coas,
            `${row.share}%`,
            ...agingValues, // Spread the generated values into the row array
        ];
    });

    // Calculate totals for the footer
    const totalPremiGross = laporanData.reduce((sum, row) => sum + row.premi_gross, 0);
    const totalDiscount = laporanData.reduce((sum, row) => sum + row.discount, 0);
    const totalBiayaAdmin = laporanData.reduce((sum, row) => sum + row.biaya_admin_materai, 0);
    const totalPremiNet = laporanData.reduce((sum, row) => sum + row.premi_net, 0);

    // Calculate totals for each aging bracket
    const agingTotals = AGING_RANGE.map(range => {
        const total = laporanData
            .filter(row => row.aging_bracket === range)
            .reduce((sum, row) => sum + (row.amount_due ?? 0), 0);
        return convertIDR(total);
    });

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
            fontSize: 6, // Reduced header font size
            cellPadding: 1,
        },
        columnStyles: {
            0: { cellWidth: 8 }, // No.
            1: { cellWidth: 20 }, // Periode Polis
            2: { cellWidth: 20 }, // No. Polis
            3: { cellWidth: 20 }, // Nama Tertanggung
            4: { cellWidth: 15 }, // Jenis Bisnis
            5: { cellWidth: 'auto' }, // Premi Gross
            6: { cellWidth: 'auto' }, // Discount
            7: { cellWidth: 15 }, // Biaya Admin
            8: { cellWidth: 'auto' }, // Premi Net
            9: { cellWidth: 25 }, // Asuransi
            10: { cellWidth: 15 }, // Keterangan
            11: { cellWidth: 10 }, // Share
            // The rest of the columns (aging brackets) will be auto-sized
        },
        foot: [ // Add footer with totals
            [
                { content: 'Total', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: convertIDR(totalPremiGross), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: convertIDR(totalDiscount), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: convertIDR(totalBiayaAdmin), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: convertIDR(totalPremiNet), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: '', colSpan: 3 },
                ...agingTotals.map(total => (
                    { content: total }
                ))
            ]
        ],
        footStyles: {
            fillColor: [236, 240, 241], // A light grey for the footer
            textColor: [44, 62, 80],
            fontStyle: 'bold',
            fontSize: 6,
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
            fontSize: 6, // Reduced body font size
            cellPadding: 1, // Reduced cell padding
        },
    });

    return doc.output('datauristring');
}