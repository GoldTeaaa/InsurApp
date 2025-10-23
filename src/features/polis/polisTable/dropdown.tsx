import Link from "next/link"
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import { Button } from "@/components/button"
import deletePolis from "@/features/polis/actions/delete_polis"


export default function PolisDropdown({ id }: { id: string }) {
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this?")) {
            const res = await deletePolis({ id });
        }
    }

    return (
        <div >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <EllipsisVerticalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/polis/${id}/edit`}>
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}