import { searchParamsProps } from "@/lib/laporan/laporan-aging-premi/types";
import { LaporanPelunasanKomisiRPCPayload, LaporanPelunasanKomisiRPCSchema } from "@/lib/laporan/laporan-pelunasan-komisi/types";
import { supabase } from "@/lib/supabase";
import { ActionReturnState } from "@/lib/types";

type ReturnState = ActionReturnState<LaporanPelunasanKomisiRPCPayload>;

export default async function getPelunasanKomisiData({
    searchParams
}: {searchParams: searchParamsProps}): Promise<ReturnState> {

    const params = await searchParams;
    const search = params?.search ?? "";
    const page = Number(params?.page ?? 1);
    const size = Number(params?.size ?? 10);
    const date_from = params?.date_from ? params.date_from : null;
    const date_to = params?.date_to ? params.date_to : null;

    const {data, error} = await supabase.rpc("get_laporan_pelunasan_komisi", {
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

    const parsedData = LaporanPelunasanKomisiRPCSchema.safeParse(data);
    if(!parsedData.success) return {
        success: false,
        message: parsedData.error.message,
    }

    return {
        success: true,
        message: "",
        data: parsedData.data
    }
}