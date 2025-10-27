import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dialog";
import AddPembayaranPremiForm from "./addPembayaranPremiForm";

type AddPremiDialogProps = {
    id: string,
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void
}

export default function AddPremiDialog({
    id,
    isOpen,
    onOpenChange
}: AddPremiDialogProps) {
    return (
        <div>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl text-slate-900 font-semibold">
                            Tambah Premi
                        </DialogTitle>
                    </DialogHeader>
                    <AddPembayaranPremiForm id={id} />
                </DialogContent>
            </Dialog>
        </div>
    );

}