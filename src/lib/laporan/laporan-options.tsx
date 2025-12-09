import { Calendar, Clock, FileText, ListChecks, DollarSign } from "lucide-react";
import { LaporanProduksiRow } from "./laporan-produksi/types";
import { LaporanAgingKomisiItem } from "./laporan-aging-komisi/types";
import { LaporanAgingPremiRow } from "./laporan-aging-premi/types";
import { LaporanPelunasanKomisiRow } from "./laporan-pelunasan-komisi/types";
import { PelunasanPremiRow } from "./laporan-pelunasan-premi/types";

export type ReportColumn<T> = {
    header: string;
    key: keyof T;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type ReportProps<T = any> = {
    id: string; // id is needed for mapping
    name: string;
    route: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    columns?: ReportColumn<T>[];
}

export const reportsConfig = {
    "produksi": {
        id: "produksi",
        name: "Produksi",
        route: "/dashboard/laporan/produksi",
        icon: Calendar,
        columns: [ // as ReportColumn<LaporanProduksiRow>[]
            { header: "Periode Mulai", key: "periode_mulai" },
            { header: "Periode Akhir", key: "periode_akhir" },
            { header: "Nomor Polis", key: "nomor_polis" },
            { header: "Nama Tertanggung", key: "nama_tertanggung" },
            { header: "Jenis Bisnis", key: "jenis_bisnis" },
            { header: "Premi", key: "premi" },
            { header: "Discount", key: "discount" },
            { header: "Biaya Admin/Materai", key: "biaya_admin_materai" },
            { header: "Premi Net", key: "premi_net" },
            { header: "No Kwitansi Komisi", key: "no_kwitansi_komisi" },
            { header: "Komisi", key: "komisi" },
            { header: "PPH Komisi", key: "pph_komisi" },
            { header: "Komisi Net", key: "komisi_net" },
            { header: "Nama Asuransi", key: "nama_perusahaan_asuransi" },
            { header: "Jenis Coas", key: "jenis_coas" },
            { header: "Share", key: "share" },
        ],
    } as ReportProps<LaporanProduksiRow>,
    "aging-premi": {
        id: "aging-premi",
        name: "Aging Premi",
        route: "/dashboard/laporan/aging-premi",
        icon: Clock,
        columns: [ // as ReportColumn<LaporanAgingPremiRow>[]
            { header: "Nomor Polis", key: "nomor_polis" },
            { header: "Nama Tertanggung", key: "nama_tertanggung" },
            { header: "Jenis Bisnis", key: "jenis_bisnis" },
            { header: "Periode Mulai", key: "periode_mulai" },
            { header: "Periode Akhir", key: "periode_akhir" },
            { header: "Premi Gross", key: "premi_gross" },
            { header: "Discount", key: "discount" },
            { header: "Biaya Admin/Materai", key: "biaya_admin_materai" },
            { header: "Premi Net", key: "premi_net" },
            { header: "Nama Asuransi", key: "nama_perusahaan_asuransi" },
            { header: "Aging (Hari)", key: "aging_bracket" },
            { header: "Status", key: "detail_premi_status" },
            { header: "Amount Due", key: "amount_due" },
            { header: "Amount Paid", key: "amount_paid" },
        ],
    } as ReportProps<LaporanAgingPremiRow>,
    "aging-komisi": {
        id: "aging-komisi",
        name: "Aging Komisi",
        route: "/dashboard/laporan/aging-komisi",
        icon: FileText,
        columns: [ // as ReportColumn<LaporanAgingKomisiItem>[]
            { header: "Nomor Polis", key: "nomor_polis" },
            { header: "Nama Tertanggung", key: "nama_tertanggung" },
            { header: "Nama Asuransi", key: "nama_perusahaan_asuransi" },
            { header: "Komisi Gross", key: "komisi_gross" },
            { header: "PPH", key: "pph" },
            { header: "Komisi Net", key: "komisi_net" },
            { header: "Amount Due", key: "amount_due" },
            { header: "Amount Paid", key: "amount_paid" },
            { header: "Status", key: "detail_komisi_status" },
            { header: "Aging (Hari)", key: "aging_bracket" },
            { header: "Periode Mulai", key: "periode_mulai" },
            { header: "Periode Akhir", key: "periode_akhir" },
        ],
    } as ReportProps<LaporanAgingKomisiItem>,
    "pelunasan-premi": {
        id: "pelunasan-premi",
        name: "Pelunasan Premi",
        route: "/dashboard/laporan/pelunasan-premi",
        icon: ListChecks,
        columns: [
            {header: "No Polis", key: "nomor_polis"},
            {header: "Nama Tertanggung", key: "nama_tertanggung"},
        ]
    } as ReportProps<PelunasanPremiRow>,
    "pelunasan-komisi": {
        id: "pelunasan-komisi",
        name: "Pelunasan Komisi",
        route: "/dashboard/laporan/pelunasan-komisi",
        icon: DollarSign,
        columns: [
            { header: "Nomor Polis", key: "nomor_polis" },
            { header: "Nama Tertanggung", key: "nama_tertanggung" },
            { header: "Jenis Bisnis", key: "jenis_bisnis" },
            { header: "Periode Mulai", key: "periode_mulai" },
            { header: "Periode Akhir", key: "periode_akhir" },
            { header: "No Kwitansi", key: "no_kwitansi" },
            { header: "Komisi Gross", key: "komisi_gross" },
            { header: "PPH Komisi", key: "pph_komisi" },
            { header: "Komisi Net", key: "komisi_net" },
            { header: "Nama Asuransi", key: "nama_perusahaan_asuransi" },
            { header: "Jenis Coas", key: "jenis_coas" },
            { header: "Share", key: "share" },
            { header: "Tanggal Bayar", key: "tanggal_bayar" },
            { header: "Status", key: "status" },
        ],
    } as ReportProps<LaporanPelunasanKomisiRow>,
};

// Export an array of the report configurations for use in navigation or lists like ReportNavBar.
export const reports: ReportProps[] = Object.values(reportsConfig);