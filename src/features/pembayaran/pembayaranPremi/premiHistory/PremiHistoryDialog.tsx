"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/dialog";
import PremiHistoryTable from "./PremiHistoryTable";
import { Button } from "@/components/button";
import { PembayaranTableRow } from "@/lib/pembayaran/pembayaran_premi/types";
import PembayaranHistoryRowDetailPreview from "../../pembayaranKomisi/komisiHistory/HistoryPembayaranRowDetailPreview";

type PremiHistoryDialogProps = {
  id: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddNew: () => void;
  onEditSuccess: () => void;
  onDeleteSuccess: () => void;
  data?: PembayaranTableRow[];
};

export default function PremiHistoryDialog({ id, isOpen, onOpenChange, onAddNew, onEditSuccess, onDeleteSuccess, data }: PremiHistoryDialogProps) {
  const rowData = data?.[0];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900 font-semibold">
            Riwayat Pembayaran Premi
          </DialogTitle>
          {rowData && (
            <DialogDescription asChild>
              <PembayaranHistoryRowDetailPreview
                type="premi"
                data={rowData}
              />
            </DialogDescription>
          )
          }
        </DialogHeader>

        <div className="py-4">
          <PremiHistoryTable
            detailPremiId={id}
            onEditSuccess={onEditSuccess}
            onDeleteSuccess={onDeleteSuccess}
          />
        </div>

        <DialogFooter className="flex-row justify-between items-center">
          {
            rowData && rowData.status !== "paid" && (
              <Button onClick={onAddNew}>Tambah Pembayaran</Button>
            )
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}