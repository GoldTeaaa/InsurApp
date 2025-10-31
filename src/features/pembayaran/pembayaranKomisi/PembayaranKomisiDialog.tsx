import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dialog";
import PembayaranKomisiForm from "./PembayaranKomisiForm";

type PembayaranKomisiDialogProps = {
    detailPembayaranKomisiId: string
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
    mode: "add" | "edit",
    onAddSuccess?: () => void;
}

export default function PembayaranKomisiDialog({
    detailPembayaranKomisiId,
    isOpen,
    onOpenChange,
    mode,
    onAddSuccess
}:PembayaranKomisiDialogProps){
    return(
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detail Pembayaran Komisi</DialogTitle>
                </DialogHeader>
                <PembayaranKomisiForm
                    mode={mode}
                    detailPembayaranKomisiId={detailPembayaranKomisiId}
                    onAddSuccess={() => { 
                        onAddSuccess?.(); 
                        onOpenChange(false); 
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}