import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "@/components/button";

type Props = {
    pembayaranKomisiId: string,
    openDetail: (id: string) => void
}

export default function PembayaranKomisiDropdown({
    pembayaranKomisiId,
    openDetail
}: Props) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <EllipsisVerticalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => openDetail(pembayaranKomisiId)}>
                        Detail Pembayaran
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Update Pembayaran
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}