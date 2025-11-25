import { PerusahaanRow } from "@/lib/perusahaan_asuransi/types";
import { ColumnDef } from "@tanstack/react-table";

const PerusahaanAsuransiColumns: ColumnDef<PerusahaanRow>[] = [
    {
        accessorKey: 'alamat',
        header: 'Nama Perusahaan',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'kontak_1',
        header: 'Kontak 1',
    },
    {
        accessorKey: 'kontak_2',
        header: 'Kontak 2',
    },
]