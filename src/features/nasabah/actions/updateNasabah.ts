'use server';
import { NasabahFormType, toRpcCreatePerusahaan, toRpcCreatePribadi } from "@/lib/nasabah/type";
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";

type ReturnState = ActionReturnState<{
    nama: string
}>;

type Props = {
    id: string;
    formData: NasabahFormType;
};

export default async function  updateNasabahAction({
    id,
    formData
}: Props): Promise<ReturnState> {
    if(!id) throw new Error("Missing id");

    const supabase = await createClient();

    let payload = {};

    if(formData.tipe === "pribadi"){
        const parsedPribadiData = toRpcCreatePribadi.safeParse(formData);
        if (!parsedPribadiData.success) {
            return {
                success: false,
                message: "Invalid data structure from API.",
            };
        }
        payload = parsedPribadiData.data;
    }else{
        const parsedPerusahaanData = toRpcCreatePerusahaan.safeParse(formData);
        if (!parsedPerusahaanData.success) {
            return {
                success: false,
                message: "Invalid data structure from API.",
            };
        }
        payload = parsedPerusahaanData.data;
    }

    const { data, error } = await supabase.rpc("update_nasabah", {
        p_update_id: id,
        ...payload
    });
    
    if(error){
        return{
            success: false,
            message: error.message,
        }
    }

    return {
        success: true,
        message: "Success",
        data: data,
    }
}