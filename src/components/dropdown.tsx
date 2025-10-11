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


export default function PolisDropdown({ id }: { id: string }) {
    const handleDelete = () => {
        // You can trigger a server action to delete the item here.
        // For now, we'll just log it and show an alert.
        console.log("Deleting polis with ID:", id)
        alert(`Delete action for Polis ID: ${id}`)
    }
    console.log("id from PolisDropdown: ", id)

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