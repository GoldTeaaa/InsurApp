import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/dialog";
import KomisiHistoryTable from "./KomisiHistoryTable";
import { useQuery } from "@tanstack/react-query";
import getHistoryPembayaranKomisi from "../actions/getHistoryPembayaranKomisi";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/button";
import HistoryRowDetailPreview from "./HistoryRowDetailPreview";
import { komisiTableRowData } from "@/lib/pembayaran/pembayaran_komisi/types";

type Props = {
    detailKomisiId: string,
    isOpen: boolean,
    detailKomisiData: komisiTableRowData,
    onOpenChange: (isOpen: boolean) => void,
    addPembayaranKomisi: () => void,
    onAddOrDeleteSuccess: () => void
}

export default function KomisiHistoryDialog({
    detailKomisiId,
    isOpen,
    detailKomisiData,
    onOpenChange,
    addPembayaranKomisi,
    onAddOrDeleteSuccess
}: Props) {

    const { data, isLoading } = useQuery({
        queryKey: ["history-pembayaran-komisi", detailKomisiId],
        queryFn: () => getHistoryPembayaranKomisi({ detailKomisiId })
    })

    const tableHistoryData = data?.success ? (data.data ?? []) : [];

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
                    <div>
                        <HistoryRowDetailPreview
                            data={detailKomisiData}
                        />
                        <KomisiHistoryTable
                            komisiHistoryData={tableHistoryData}
                            onAddOrDeleteSuccess={onAddOrDeleteSuccess}
                        />
                    </div>
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