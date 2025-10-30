import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/dialog";

type Props = {
    detailKomisiId: string
}

export default function KomisiHistoryDialog({
    detailKomisiId
}:Props){
    return(
        <div>
            <Dialog>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl text-slate-900 font-semibold">
                            Riwayat Pembayaran Komisi
                        </DialogTitle>
                    </DialogHeader>

                </DialogContent>
            </Dialog>
        </div>
    );
}