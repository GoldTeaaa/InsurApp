"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type PembayaranPremiDropdownProps = {
  pembayaranPremiId: string;
  onRowClick: (pembayaranPremiId: string) => void;
};

export default function PembayaranPremiDropdown({ pembayaranPremiId, onRowClick }: PembayaranPremiDropdownProps) {
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
          <DropdownMenuItem onClick={() => onRowClick(pembayaranPremiId)}>
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