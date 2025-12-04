import { LaporanAgingKomisiItem } from "@/lib/laporan/laporan-aging-komisi/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate, formatDateRange } from "../../../../lib/utils/formatDate";
import { AGING_RANGE } from "@/lib/types";

const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });
};

export function generateAgingKomisiPDF(
    laporanData: LaporanAgingKomisiItem[],
    startDate?: string,
    endDate?: string
) {
    const doc = new jsPDF({
        orientation: "landscape",
    });
    let no = 1;

    // Add Title
    doc.setFontSize(16);
    doc.text("Laporan Aging Komisi", 14, 22);
    if (startDate && endDate) {
        doc.setFontSize(10);
        doc.text(`Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`, 14, 28);
    }

    // Define table columns
    const head = [
        [
            "No",
            "Periode Polis",
            "No. Polis",
            "Nama Tertanggung",
            "Jenis Bisnis",
            "Komisi Gross",
            "PPH",
            "Komisi Net",
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
            row.aging_bracket === range ? formatCurrency(row.amount_due) : "-"
        );

        return [
            no++,
            formatDateRange(row.periode_mulai, row.periode_akhir),
            row.nomor_polis,
            row.nama_tertanggung,
            row.jenis_bisnis,
            formatCurrency(row.komisi_gross),
            formatCurrency(row.pph),
            formatCurrency(row.komisi_net),
            row.nama_perusahaan_asuransi,
            row.jenis_coas,
            `${row.share}%`,
            ...agingValues, // Spread the generated values into the row array
        ];
    });

    // Calculate totals for the footer
    const totalKomisiGross = laporanData.reduce((sum, row) => sum + row.komisi_gross, 0);
    const totalPph = laporanData.reduce((sum, row) => sum + row.pph, 0);
    const totalKomisiNet = laporanData.reduce((sum, row) => sum + row.komisi_net, 0);

    // Calculate totals for each aging bracket
    const agingTotals = AGING_RANGE.map(range => {
        const total = laporanData
            .filter(row => row.aging_bracket === range)
            .reduce((sum, row) => sum + (row.amount_due ?? 0), 0);
        return formatCurrency(total);
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
            fontSize: 6,
            cellPadding: 1,
        },
        columnStyles: {
            0: { cellWidth: 8 }, // No.
            1: { cellWidth: 20 }, // Periode Polis
            2: { cellWidth: 20 }, // No. Polis
            3: { cellWidth: 25 }, // Nama Tertanggung
            4: { cellWidth: 15 }, // Jenis Bisnis
            5: { cellWidth: 'auto' }, // Komisi Gross
            6: { cellWidth: 'auto' }, // PPH
            7: { cellWidth: 'auto' }, // Komisi Net
            8: { cellWidth: 25 }, // Asuransi
            9: { cellWidth: 15 }, // Keterangan
            10: { cellWidth: 10 }, // Share
        },
        foot: [
            [
                { content: 'Total', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalKomisiGross), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalPph), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalKomisiNet), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: '', colSpan: 3 },
                ...agingTotals.map(total => ({ content: total }))
            ]
        ],
        footStyles: { fillColor: [236, 240, 241], textColor: [44, 62, 80], fontStyle: 'bold', fontSize: 6 },
        didDrawPage: (data) => {
            doc.setFontSize(10);
            doc.text(`Page ${doc.internal.pages.length - 1} of ${doc.getNumberOfPages()}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
            doc.text(`Tanggal Pembuatan: ${new Date().toLocaleDateString('id-ID')}`, doc.internal.pageSize.width - data.settings.margin.right, doc.internal.pageSize.height - 10, { align: 'right' });
        },
        styles: { fontSize: 6, cellPadding: 1 },
    });

    return doc.output('datauristring');
}