"use client";
import { useState } from "react";
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
    pembayaranPremiId: string
    onEdit: (pembayaranPremiId: string) => void;
    onDelete: (pembayaranPremiId: string) => void;
}

export default function EditOrDeletePremiDropdown({ 
    pembayaranPremiId,
    onEdit,
    onDelete
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
                    <DropdownMenuItem onClick={() => onEdit(pembayaranPremiId)}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(pembayaranPremiId)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}