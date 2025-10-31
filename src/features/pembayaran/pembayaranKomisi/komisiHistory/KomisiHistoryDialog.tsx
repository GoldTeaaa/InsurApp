import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/dialog";
import KomisiHistoryTable from "./KomisiHistoryTable";
import { useQuery } from "@tanstack/react-query";
import getHistoryPembayaranKomisi from "../actions/getHistoryPembayaranKomisi";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/button";

type Props = {
    detailKomisiId: string,
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
    addPembayaranKomisi: () => void,
    onAddSuccess: () => void
}

export default function KomisiHistoryDialog({
    detailKomisiId,
    isOpen,
    onOpenChange,
    addPembayaranKomisi,
    onAddSuccess
}: Props) {

    const { data, isLoading } = useQuery({
        queryKey: ["history-pembayaran-komisi", detailKomisiId],
        queryFn: () => getHistoryPembayaranKomisi({ detailKomisiId })
    })

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle className="text-xl text-slate-900 font-semibold">
                        Riwayat Pembayaran Komisi
                    </DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Spinner />
                    </div>
                ) : (
                    <KomisiHistoryTable
                        komisiHistoryData={data?.success ? (data.data ?? []) : []}
                        onAddSuccess={onAddSuccess}
                    />
                )}
                <DialogFooter>
                    <Button
                        onClick={addPembayaranKomisi}
                    >
                        Tambah Pembayaran
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}