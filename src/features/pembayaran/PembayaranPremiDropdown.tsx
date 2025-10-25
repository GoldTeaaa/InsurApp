"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "@/components/button";
import PremiHistoryTable from "./premiHistory/PremiHistoryTable";

export default function PembayaranPremiDropdown({ id }: { id: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <EllipsisVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setIsModalOpen(true)}>
            Detail Pembayaran
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg text-white font-semibold">Riwayat Pembayaran - ID: {id}</DialogTitle>
        </DialogHeader>
        <PremiHistoryTable id={id} />
      </DialogContent>
    </Dialog>
  );
}