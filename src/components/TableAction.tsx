import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteConfirmationMenuItem from "./DeleteConfirmationMenuItem";
import { TableMetaAction } from "@/lib/perusahaan_asuransi/types/tableActionType";

type TableActionProps = {
    id: string,
    item?: string
} & TableMetaAction

export default function TableAction({
    id,
    item,
    handleEdit,
    handleDelete
}: TableActionProps) {
    console.log('id', id, 'item', item);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <EllipsisVerticalIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleEdit(id)}>
                    Update
                </DropdownMenuItem>
                <DeleteConfirmationMenuItem
                    onConfirm={() => handleDelete(id)}
                    className="text-red-600 focus:bg-red-50 focus:text-red-700"
                    item={item}
                >
                    Delete
                </DeleteConfirmationMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}