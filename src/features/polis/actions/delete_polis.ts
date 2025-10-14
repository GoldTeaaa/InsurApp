'use server';
import { supabase } from "@/lib/supabase";
import { ActionReturnState } from "@/lib/types";
import { revalidatePath } from "next/cache";

type ReturnState = ActionReturnState;

export default async function deletePolis({id}: {id: string}):Promise<ReturnState> {
    const {data, error} = await supabase.rpc('delete_polis',{
        p_polis_id: id
    })

    if(error){
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "Success"
    }
}