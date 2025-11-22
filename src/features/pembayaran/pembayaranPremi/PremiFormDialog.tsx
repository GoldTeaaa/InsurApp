import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dialog";
import PembayaranPremiForm from "./PembayaranPremiForm";
import { AddPembayaranPremiForm } from "@/lib/pembayaran/pembayaran_premi/types";

type AddPremiDialogProps = {
    id: string,
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
    onSuccess: () => void;
    updateValues?: AddPembayaranPremiForm
}

export default function PremiFormDialog({
    id,
    isOpen,
    onOpenChange,
    onSuccess,
    updateValues
}: AddPremiDialogProps) {
    return (
        <div>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl text-slate-900 font-semibold">
                            {updateValues ? "Ubah Pembayaran Premi" : "Tambah Pembayaran Premi"}
                        </DialogTitle>
                    </DialogHeader>
                    <PembayaranPremiForm
                        id={id}
                        onSuccess={onSuccess}
                        updateValues={updateValues}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );

}