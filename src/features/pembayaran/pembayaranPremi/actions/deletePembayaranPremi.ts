"use server";
import { createClient } from "~/utils/supabase/server";

type State = {
    success: boolean;
    message: string;
};

export default async function deletePembayaranPremi(id: string):Promise<State>{
    const supabase = await createClient();
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