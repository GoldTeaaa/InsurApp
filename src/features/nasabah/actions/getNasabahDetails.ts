'use server';
import { 
    type NasabahForm, 
    perusahaanSchema, 
    pribadiSchema 
} from "@/lib/nasabah/type";
import { supabase } from "@/lib/supabase";
import { ActionReturnState } from "@/lib/types";

type ReturnState = ActionReturnState<NasabahForm>;

type Props = {
    id: string
}

export default async function getNasabahDetails({id}: Props):Promise<ReturnState> {
    const {data, error} = await supabase
    .from('initial_update_nasabah_value')
    .select()
    .eq('id', id)
    .single();

    if(error){
        return {
            success: false,
            message: error.code === 'PGRST116' 
                ? `Nasabah dengan ID "${id}" tidak ditemukan.`
                : error.message,
        }
    }

    if(data.tipe === 'pribadi'){
        const parsedPribadiData = pribadiSchema.safeParse(data);
        if (!parsedPribadiData.success) {
            return {
                success: false,
                message: parsedPribadiData.error.message,
            };
        }
        return {
            success: true,
            message: "Success",
            data: parsedPribadiData.data,
        }
    }else{
        const parsedPerusahaanData = perusahaanSchema.safeParse(data);
        if (!parsedPerusahaanData.success) {
            return {
                success: false,
                message: parsedPerusahaanData.error.message
            };
        }
        return {
            success: true,
            message: "Success",
            data: parsedPerusahaanData.data,
        }
    }
}