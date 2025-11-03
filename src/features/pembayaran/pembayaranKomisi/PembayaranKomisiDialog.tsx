import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dialog";
import PembayaranKomisiForm from "./PembayaranKomisiForm";
import { HistoryPembayaranKomisiTableRow } from "@/lib/pembayaran/pembayaran_komisi/types";

type PembayaranKomisiDialogProps = {
    detailKomisiId?: string,
    pembayaranKomisiId?: string,
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
    mode: "add" | "edit",
    onAddSuccess?: () => void;
    updateValues?: HistoryPembayaranKomisiTableRow;
}

export default function PembayaranKomisiDialog({
    detailKomisiId,
    pembayaranKomisiId,
    isOpen,
    onOpenChange,
    mode,
    onAddSuccess,
    updateValues
}: PembayaranKomisiDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detail Pembayaran Komisi</DialogTitle>
                </DialogHeader>
                <PembayaranKomisiForm
                    mode={mode}
                    {...mode === "edit" ?
                        {
                            pembayaranKomisiId: pembayaranKomisiId ?? "",
                            updateValues: updateValues
                        }
                        : { detailKomisiId: detailKomisiId ?? "" }
                    }
                    onAddSuccess={() => {
                        onAddSuccess?.();
                        onOpenChange(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}