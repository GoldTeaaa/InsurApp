"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import PremiHistoryTable from "./PremiHistoryTable";
import { Button } from "@/components/button";

type PremiHistoryDialogProps = {
  id: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddNew: () => void;
};

export default function PremiHistoryDialog({ id, isOpen, onOpenChange, onAddNew }: PremiHistoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900 font-semibold">
            Riwayat Pembayaran Premi
            </DialogTitle>
        </DialogHeader>
        <PremiHistoryTable id={id} />
        <DialogFooter>
          <Button onClick={onAddNew}>Tambah Pembayaran</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}