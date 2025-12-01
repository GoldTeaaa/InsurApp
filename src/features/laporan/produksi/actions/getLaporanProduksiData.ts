'use server';
import { laporanProduksiRPCSchema, RPCGetLaporanProduksi } from "@/lib/laporan/laporan-produksi/types";
import { supabase } from "~/utils/supabase/client";
import { ActionReturnState, SearchParamsProps } from "@/lib/types";

type ReturnState = ActionReturnState<RPCGetLaporanProduksi>;

export default async function getLaporanProduksiData({
    searchParams
}: { searchParams: SearchParamsProps }): Promise<ReturnState> {

    const params = await searchParams;
    const search = params?.search ?? "";
    const page = Number(params?.page ?? 1);
    const size = Number(params?.size ?? 10);

    const { data, error } = await supabase.rpc("get_laporan_produksi",{
        p_page: page,
        p_size: size,
        p_search: search
    })
    console.log('data: ', data);

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