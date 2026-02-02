"use server";
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";
import { ListOfPerusahaanCardSchema, PerusahaanCardListType } from "@/lib/perusahaan_asuransi/types/perusahaan-card-data";

type ReturnState = ActionReturnState<PerusahaanCardListType>;

export default async function fetchPerusahaanCard(
    search: string | null
): Promise<ReturnState> {
    const supabase = await createClient();

    const {data, error} = await supabase
    .from('perusahaan_asuransi_card')
    .select('*')
    .ilike('nama', `%${search}%`);

    if(error) return{
        success: false,
        message: error.message
    }

    const parsedData = ListOfPerusahaanCardSchema.safeParse(data);

    if(!parsedData.success) return{
        success: false,
        message: parsedData.error.message
    }

    // console.log("data: ", parsedData);

    return {
        success: true,
        message: "Success",
        data: parsedData.data
    }
}