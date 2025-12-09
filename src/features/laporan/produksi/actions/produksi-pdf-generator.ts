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
            'No',
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
    const body: (string | number | { content: string | number, colSpan?: number, styles?: object })[][] = [];
    let no = 1;
    let group: LaporanProduksiRow[] = [];

    for (let i = 0; i < laporanData.length; i++) {
        const row = laporanData[i];
        group.push(row);

        const isLastRow = i === laporanData.length - 1;
        const nextRow = laporanData[i + 1];
        const isGroupEnd = isLastRow || (nextRow && nextRow.nomor_polis !== row.nomor_polis);

        if (isGroupEnd) {
            // Add rows for the current group
            group.forEach((groupRow, index) => {
                const isFirstInGroup = index === 0;
                body.push([
                    no++,
                    isFirstInGroup ? groupRow.nomor_polis : '',
                    isFirstInGroup ? groupRow.nama_tertanggung : '',
                    isFirstInGroup ? `${formatDate(groupRow.periode_mulai)} - ${formatDate(groupRow.periode_akhir)}` : '',
                    isFirstInGroup ? groupRow.jenis_bisnis : '',
                    formatCurrency(groupRow.premi),
                    formatCurrency(groupRow.discount),
                    formatCurrency(groupRow.biaya_admin_materai),
                    formatCurrency(groupRow.premi_net),
                    groupRow.no_kwitansi_komisi,
                    formatCurrency(groupRow.komisi),
                    formatCurrency(groupRow.pph_komisi),
                    formatCurrency(groupRow.komisi_net),
                    groupRow.nama_perusahaan_asuransi,
                    groupRow.jenis_coas,
                    groupRow.share != null ? `${groupRow.share}%` : '',
                ]);
            });

            // Add subtotal row if it's a co-insurance group
            if (group.length > 1) {
                const subTotals = group.reduce((acc, r) => ({
                    premi: acc.premi + r.premi,
                    discount: acc.discount + r.discount,
                    biaya_admin_materai: acc.biaya_admin_materai + r.biaya_admin_materai,
                    premi_net: acc.premi_net + r.premi_net,
                    komisi: acc.komisi + r.komisi,
                    pph_komisi: acc.pph_komisi + r.pph_komisi,
                    komisi_net: acc.komisi_net + r.komisi_net,
                }), { premi: 0, discount: 0, biaya_admin_materai: 0, premi_net: 0, komisi: 0, pph_komisi: 0, komisi_net: 0 });

                const subtotalRow = [
                    { content: 'Total', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: formatCurrency(subTotals.premi), styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: formatCurrency(subTotals.discount), styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: formatCurrency(subTotals.biaya_admin_materai), styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: formatCurrency(subTotals.premi_net), styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: '' },
                    { content: formatCurrency(subTotals.komisi), styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: formatCurrency(subTotals.pph_komisi), styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: formatCurrency(subTotals.komisi_net), styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: '', colSpan: 3 },
                ];
                body.push(subtotalRow);
            }

            // Add a spacer row between different policy groups, but not after the last one
            if (!isLastRow) {
                body.push([{ content: '', colSpan: 16, styles: { cellPadding: 1 } }]);
            }

            // Reset for the next group
            group = [];
        }
    }

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
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 7,
        },
        foot: [ // Add footer with totals
            [
                { content: 'Grand Total', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalPremi), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: formatCurrency(totalDiscount), styles: { halign: 'right', fontStyle: 'bold' } }, // Corrected typo
                { content: formatCurrency(totalBiayaAdmin), styles: { halign: 'right', fontStyle: 'bold' } }, // Corrected typo
                { content: formatCurrency(totalPremiNet), styles: { halign: 'right', fontStyle: 'bold' } }, // Corrected typo
                { content: '' }, // No total for kwitansi
                { content: formatCurrency(totalKomisi), styles: { halign: 'right', fontStyle: 'bold' } }, // Corrected typo
                { content: formatCurrency(totalPphKomisi), styles: { halign: 'right', fontStyle: 'bold' } }, // Corrected typo
                { content: formatCurrency(totalKomisiNet), styles: { halign: 'right', fontStyle: 'bold' } }, // Corrected typo
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

    // Save the PDF
    // const datePart = startDate && endDate
    //     ? `${formatDate(startDate)}_to_${formatDate(endDate)}`
    //     : 'all_time';
    //
    // const fileName = `Laporan_Produksi_${datePart}.pdf`;
    //
    // doc.save(fileName);

    console.log("doc.output('datauristring'): ", doc.output('datauristring'));
    return doc.output('datauristring');
}