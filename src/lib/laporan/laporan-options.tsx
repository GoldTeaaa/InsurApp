import { Calendar, Clock, FileText, ListChecks, DollarSign } from "lucide-react";

export const reports = [
    {
        id: "produksi",
        name: "Produksi",
        route: "/dashboard/laporan/produksi",
        icon: Calendar
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