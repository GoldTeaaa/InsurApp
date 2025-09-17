'use server';
import {
    NasabahForm,
    toRpcCreatePribadi,
    toRpcCreatePerusahaan
} from "@/lib/nasabah/type";
import { ActionReturnState } from "@/lib/types";
import { supabase } from "@/lib/supabase";

type ReturnState = ActionReturnState<NasabahForm>;

export default async function createNasabahAction(formData: NasabahForm): Promise<ReturnState> {
    if (formData.tipe === 'perusahaan') {
        const args = toRpcCreatePerusahaan.safeParse(formData);
        
        if(!args.success) {
            return {
                success: false,
                message: 'Input tidak valid.',
                errors: args.error.flatten().fieldErrors,
            }
        }
        console.log('args: ', args.data);

        const { data, error } = await supabase.rpc('nasabah_create_perusahaan_v1', args.data)
        if (error) console.error(error)
        else console.log(data)
    }else{
        const args = toRpcCreatePribadi.safeParse(formData);
        
        if(!args.success) {
            return {
                success: false,
                message: 'Input tidak valid.',
                errors: args.error.flatten().fieldErrors,
            }
        }
        console.log('args: ', args.data);

        const { data, error } = await supabase.rpc('nasabah_create_pribadi_v1', args.data)
        if (error) console.error(error)
        else console.log(data)
    }

    return({
        success: true,
        message: `Berhasil menyimpan nasabah ${formData.nama}`,
    });
}

// nasabah_create_perusahaan_v1
// nasabah_create_pribadi_v1
