'use server';
import { 
    type NasabahFormType, 
    perusahaanSchema, 
    pribadiSchema 
} from "@/lib/nasabah/type";
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";

type ReturnState = ActionReturnState<NasabahFormType>;

export default async function getNasabahDetails(id: string):Promise<ReturnState> {
    const supabase = await createClient();
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