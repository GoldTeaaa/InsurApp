'use server';

import { ListPerusahaan, type ListPerusahaanType } from "@/lib/polis/step3";
import { ActionReturnState } from "@/lib/types";
import { supabase } from "@/lib/supabase";

type ReturnState = ActionReturnState<ListPerusahaanType[]>;

export default async function getPerusahaanList():Promise<ReturnState> {

    const {data, error} = await supabase
    .from("perusahaan_asuransi")
    .select("id, value:nama") // Select `nama` column and alias it as `nama_perusahaan`
    .order("nama") // Order by the original column name `nama`
    .limit(100);

    if (error){
        return{
            success : false,
            message : error.message,
        }
    };

    const parsedData = ListPerusahaan.array().safeParse(data);
    return{
        success : true,
        message : "Success",
        data : parsedData.success ? parsedData.data : [],
    }
}