import { PerusahaanRow } from "@/lib/perusahaan_asuransi/types";
import { ColumnDef } from "@tanstack/react-table";
// import { DeletePerusahaanAsuransi, UpdatePerusahaanAsuransi } from "./buttons";
import TableAction from "@/components/table/TableAction";
import { TableMetaAction } from "@/lib/perusahaan_asuransi/types/tableActionType";


export const PerusahaanAsuransiColumns: ColumnDef<PerusahaanRow>[] = [
    {
        accessorKey: 'nama',
        header: 'Nama Perusahaan',
    },
    {
        accessorKey: 'alamat',
        header: 'Alamat',
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
        cell: ({ row, table }) => {
            const { handleDelete, handleEdit } = table.options.meta as TableMetaAction;
            const id = row.original.id;
            const nama = row.original.nama;
            return (
                <div className="flex gap-2">
                    <TableAction
                        id={id}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        item={nama}
                    />
                </div>
            )
        }
    }
]