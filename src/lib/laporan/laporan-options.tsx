import { Calendar, Clock, FileText, ListChecks, DollarSign } from "lucide-react";
import { LaporanProduksiRow } from "./laporan-produksi/types";

export type ReportColumn = {
    header: string;
    key: keyof LaporanProduksiRow;
}

type ReportProps = {
    id: string;
    name: string;
    route: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    columns?: ReportColumn[];
}

export const reports: ReportProps[] = [
    {
        id: "produksi",
        name: "Produksi",
        route: "/dashboard/laporan/produksi",
        icon: Calendar,
        columns: [
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
    },
    {
        id: "aging-premi",
        name: "Aging Premi",
        route: "/dashboard/laporan/aging-premi",
        icon: Clock
    },
    {
        id: "aging-komisi",
        name: "Aging Komisi",
        route: "/dashboard/laporan/aging-komisi",
        icon: FileText
    },
    {
        id: "pelunasan-premi",
        name: "Pelunasan Premi",
        route: "/dashboard/laporan/pelunasan-premi",
        icon: ListChecks
    },
    {
        id: "pelunasan-komisi",
        name: "Pelunasan Komisi",
        route: "/dashboard/laporan/pelunasan-komisi",
        icon: DollarSign
    },
];