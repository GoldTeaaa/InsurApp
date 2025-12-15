'use server';
import { 
    type PelunasanPremiRPC, 
    PelunasanPremiRPCSchema 
} from "@/lib/laporan/laporan-pelunasan-premi/types";
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState, SearchParamsProps } from "@/lib/types";

type ReturnState = ActionReturnState<PelunasanPremiRPC>   

export default async function getPelunasanPremiData({
    searchParams
}: {searchParams: SearchParamsProps}): Promise<ReturnState> {
    const supabase = await createClient();

    const params = await searchParams;
    const search = params?.search ?? "";
    const page = Number(params?.page ?? 1);
    const size = Number(params?.size ?? 10);
    const date_from = params?.date_from ? params.date_from : null;
    const date_to = params?.date_to ? params.date_to : null;

    const {data, error} = await supabase.rpc("get_laporan_pelunasan_premi", {
        p_search: search,
        p_page: page,
        p_size: size,
        p_date_from: date_from,
        p_date_to: date_to
    })

    if(error) return {
        success: false,
        message: error.message
    }

    const parsedData = PelunasanPremiRPCSchema.safeParse(data);
    if(!parsedData.success) return {
        success: false,
        message: parsedData.error.message,
    }

    return{
        success: true,
        message: "",
        data: parsedData.data
    }
}