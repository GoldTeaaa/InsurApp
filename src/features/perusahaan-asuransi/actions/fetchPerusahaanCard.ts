"use server";
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";
import { PerusahaanCardType } from "@/lib/perusahaan_asuransi/types/perusahaan-card-data";

type ReturnState = ActionReturnState<PerusahaanCardType>;

export default async function fetchPerusahaanCard(): Promise<ReturnState> {
    const supabase = await createClient();

    const {data, error} = await supabase.rpc('perusahaan_asuransi_card');

    if(error) return{
        success: false,
        message: error.message
    }

    console.log("data: ", data);

    return {
        success: true,
        message: "Success",
        data
    }
}