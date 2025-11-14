'use server';
import { searchParamsProps } from "@/lib/laporan/laporan-aging-premi/types";
import { laporanProduksiRPCSchema, RPCGetLaporanProduksi } from "@/lib/laporan/laporan-produksi/types";
import { supabase } from "@/lib/supabase";
import { ActionReturnState } from "@/lib/types";

type TableParams = {
    page: number;
    size: number;
    search: string;
};

type ReturnState = ActionReturnState<RPCGetLaporanProduksi>;

export default async function getLaporanProduksiData({
    searchParams
}: { searchParams: searchParamsProps }): Promise<ReturnState> {

    const params = await searchParams;
    const search = params?.search ?? "";
    const page = Number(params?.page ?? 1);
    const size = Number(params?.size ?? 10);

    const { data, error } = await supabase.rpc("get_laporan_produksi",{
        p_page: page,
        p_size: size,
        p_search: search
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