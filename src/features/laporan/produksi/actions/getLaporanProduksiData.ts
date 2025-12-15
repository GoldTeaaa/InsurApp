'use server';
import { laporanProduksiRPCSchema, RPCGetLaporanProduksi } from "@/lib/laporan/laporan-produksi/types";
import { ActionReturnState, SearchParamsProps } from "@/lib/types";
import { createClient } from "~/utils/supabase/server";

type ReturnState = ActionReturnState<RPCGetLaporanProduksi>;

export default async function getLaporanProduksiData({
    searchParams
}: { searchParams: SearchParamsProps }): Promise<ReturnState> {
    const supabase = await createClient();

    const params = await searchParams;
    const search = params?.search ?? "";
    const page = Number(params?.page ?? 1);
    const size = Number(params?.size ?? 10);
    const date_from = params?.date_from ? params.date_from : null;
    const date_to = params?.date_to ? params.date_to : null;

    const { data, error } = await supabase.rpc("get_laporan_produksi",{
        p_page: page,
        p_size: size,
        p_search: search,
        p_date_from: date_from,
        p_date_to: date_to
    })

    const parsedData = laporanProduksiRPCSchema.safeParse(data);
    if(!parsedData.success){
        return {
            success: false,
            message: parsedData.error.message,
        }
    }
    
    if(error) return {
        success: false,
        message: error.message,
    }
    
    return ({
        success: true,
        message: "",
        data: parsedData.data
    })
}