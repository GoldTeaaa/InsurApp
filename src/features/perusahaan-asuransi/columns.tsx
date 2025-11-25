import { PerusahaanRow } from "@/lib/perusahaan_asuransi/types";
import { ColumnDef } from "@tanstack/react-table";
import { DeletePerusahaanAsuransi, UpdatePerusahaanAsuransi } from "./buttons";

export const PerusahaanAsuransiColumns: ColumnDef<PerusahaanRow>[] = [
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
    {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
            const id = row.original.id;
            return (
                <div className="flex gap-2">
                    <UpdatePerusahaanAsuransi
                        id={id}
                    />
                    <DeletePerusahaanAsuransi
                        id={id}
                    />
                </div>
            )
        }
    }
]