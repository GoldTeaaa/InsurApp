import { HistoryPembayaranKomisiTableData, HistoryPembayaranKomisiTableDataSchema } from "@/lib/pembayaran/pembayaran_komisi/types";
import { supabase } from "@/lib/supabase"
import { ActionReturnState } from "@/lib/types"

type Props = {
    detailKomisiId: string
}

type ReturnState = ActionReturnState<HistoryPembayaranKomisiTableData>;

export default async function getHistoryPembayaranKomisi({
    detailKomisiId
}:Props): Promise<ReturnState> {

    const {data, error} = await supabase
    .from("pembayaran_komisi_history_view")
    .select("nomor_polis, amount_paid, tanggal_bayar, cara_bayar, rekening_bank, no_kwitansi, pembayaran_komisi_id")
    .eq("detail_komisi_id", detailKomisiId)
    .order("tanggal_bayar", {ascending: false})

    const parsedData = HistoryPembayaranKomisiTableDataSchema.safeParse(data);

    if(error){
        return {
            success: false,
            message: error.message
        }
    }

    if(!parsedData.success){
        return {
            success: false,
            message: parsedData.error.message
        }
    }

    return {
        success: true,
        message: "Success",
        data: parsedData.data
    }

}