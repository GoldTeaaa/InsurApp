'use server';
import { kendaraanListSchema, KendaraanListType } from "@/lib/kendaraan/types";
import { ActionReturnState } from "@/lib/types";
import { createClient } from "~/utils/supabase/server";

type ReturnState = ActionReturnState<KendaraanListType>;

export default async function getKendaraanList():Promise<ReturnState> {
    const supabase = await createClient();

    const {data, error} = await supabase
    .from("kendaraan")
    .select("kendaraan_id, plat_nomor") // Select `nama` column and alias it as `nama_perusahaan`
    .order("plat_nomor") // Order by the original column name `nama`
    .limit(100);

    if(error){
        return{
            success : false,
            message : error.message,
        }
    };

    console.log("before parse kendaraan data: ", data);
    const parsedData = kendaraanListSchema.safeParse(data);
    
    if(!parsedData.success){
        return{
            success : false,
            message : parsedData.error.message,
        }
    }
    console.log("After parse kendaraan data: ", parsedData.data);

    return{
        success : true,
        message : "Success",
        data : parsedData.data,
    }
}