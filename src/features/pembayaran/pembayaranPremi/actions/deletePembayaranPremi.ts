"use server";
import { supabase } from "~/utils/supabase/client";

type State = {
    success: boolean;
    message: string;
};

export default async function deletePembayaranPremi(id: string):Promise<State>{
    const { data, error } = await supabase.rpc('delete_pembayaran_premi',{
        p_pembayaran_id: id
    })

    if(error){
        return{
            success: false,
            message: error.message
        }
    }

    return{
        success: true,
        message: 'Berhasil menghapus'
    }
}