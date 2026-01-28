'use server';
import { NasabahForm, toRpcCreatePerusahaan, toRpcCreatePribadi } from "@/lib/nasabah/type";
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";
import { redirect } from "next/navigation";

type ReturnState = ActionReturnState<NasabahForm>;

type Props = {
    id: string;
    formData: NasabahForm;
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
    console.log('update id', id)
    console.log("payload: ", payload);

    const { data, error } = await supabase.rpc("update_nasabah", {
        p_update_id: id,
        ...payload
    });
    
    if(error){
        return{
            success: false,
            message: error.message
        }
    }
    
    redirect("/dashboard/nasabah")
    // return{
    //     success: true,
    //     message: "Success"
    // }
}