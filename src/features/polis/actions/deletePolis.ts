'use server';
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";

type ReturnState = ActionReturnState;

export default async function deletePolis({id}: {id: string}):Promise<ReturnState> {
    const supabase = await createClient();
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