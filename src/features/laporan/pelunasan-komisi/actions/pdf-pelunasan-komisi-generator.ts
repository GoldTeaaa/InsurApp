import { LaporanPelunasanKomisiRow } from "@/lib/laporan/laporan-pelunasan-komisi/types";
import { convertIDR } from "@/lib/utils/convertIDR";
import { formatDate, formatDateRange } from "@/lib/utils/formatDate";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generatePelunasanKomisiPDF(
    laporanData: LaporanPelunasanKomisiRow[],
    startDate: string,
    endDate: string
) {

    const doc = new jsPDF({
        orientation: "landscape",
    })
    let no = 1;

    doc.setFontSize(16);
    doc.text("Laporan Pelunasan Komisi", 14, 22);
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
            "Nomor Kwitansi",
            "Komisi Gross",
            "PPH",
            "Komisi Net",
            "Nama Perusahaan Asuransi",
            "Keterangan",
            "Share",
            "Tgl. Bayar",
            "No. Rekening",
        ]
    ]

    const body = laporanData.map((item) => {
        return [
            no++,
            formatDateRange(item.periode_mulai, item.periode_akhir),
            item.nomor_polis,
            item.nama_tertanggung,
            item.bisnis,
            item.no_kwitansi,
            convertIDR(item.komisi_gross),
            convertIDR(item.pph_komisi),
            convertIDR(item.komisi_net),
            item.nama_perusahaan_asuransi,
            item.jenis_coas,
            `${item.share}%`,
            item.tanggal_bayar ? formatDate(item.tanggal_bayar) : '-',
            // item.nomor_rekening,
        ]
    })

    // Calculate totals for the footer
    const totalKomisiGross = laporanData.reduce((sum, row) => sum + row.komisi_gross, 0);
    const totalPPH = laporanData.reduce((sum, row) => sum + row.pph_komisi, 0);
    const totalKomisiNet = laporanData.reduce((sum, row) => sum + row.komisi_net, 0);

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
                { content: 'Total', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: convertIDR(totalKomisiGross), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: convertIDR(totalPPH), styles: { halign: 'right', fontStyle: 'bold' } },
                { content: convertIDR(totalKomisiNet), styles: { halign: 'right', fontStyle: 'bold' } },
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
            6: { halign: 'right' }, // Komisi Gross
            7: { halign: 'right' }, // PPH
            8: { halign: 'right' }, // Komisi Net
            11: { halign: 'right' }, // Share
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
            fontSize: 6,
            cellPadding: 1,
        },
    });

    return doc.output('datauristring');
}