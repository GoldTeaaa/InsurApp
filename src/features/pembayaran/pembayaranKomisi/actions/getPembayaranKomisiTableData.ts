'use server';
import { komisiTableData } from "@/lib/pembayaran/pembayaran_komisi/types";
import { supabase } from "@/lib/supabase";
import { ActionReturnState, TableParams } from "@/lib/types";

type ReturnState = ActionReturnState<komisiTableData>;

export default async function getPembayaranKomisiTableData({
    search,
    page,
    size,
    status
}: TableParams): Promise<ReturnState> {

    const {data, error} = await supabase.rpc('komisi_pembayaran_table',{
        p_search: search,
        p_page: page,
        p_size: size,
        p_status: status
    })

    if(error) return{
        success: false,
        message: error.message
    }
    
    return{
        success: true,
        message: 'Success',
        data
    }
}