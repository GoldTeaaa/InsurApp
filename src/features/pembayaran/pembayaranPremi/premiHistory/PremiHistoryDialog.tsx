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
import { getStatusClass } from "@/lib/utils/getStatusBadge";
import { formatCurrencyIDR } from "@/lib/utils/formatCurrencyIDR";

type PremiHistoryDialogProps = {
  id: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddNew: () => void;
  onEditSuccess: () => void;
  data?: PembayaranTableRow[];
};

export default function PremiHistoryDialog({ id, isOpen, onOpenChange, onAddNew, onEditSuccess, data }: PremiHistoryDialogProps) {
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
              <div className="pt-2 text-sm text-slate-700 space-y-1">
                <p><span className="font-semibold">Nomor Polis:</span> {rowData.nomor_polis}</p>
                <p>
                  <span className="font-semibold">Total Premi:</span> {formatCurrencyIDR(rowData.amount)}
                </p>
                <p>
                  <span className="font-semibold">Total Sudah Dibayar:</span> {formatCurrencyIDR(rowData.total_paid)}
                </p>
                <p className="flex items-center">
                  <span className="font-semibold">Sisa Harus Dibayar:</span>
                  <span className={`ml-2 font-bold text-base ${rowData.remaining === 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {rowData.remaining === 0 ?
                      "Sudah Lunas" : formatCurrencyIDR(rowData.remaining)}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Status:</span>
                  <span className={getStatusClass(rowData.status)}>{rowData.status.replace('_', ' ')}</span>
                </p>
              </div>
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-4">
          <PremiHistoryTable
            detailPremiId={id}
            onEditSuccess={onEditSuccess}
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