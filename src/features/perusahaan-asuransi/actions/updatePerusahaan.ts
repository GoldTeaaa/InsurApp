"use server";
import {
    type PerusahaanReturnResult,
    perusahaanUpdateFormSchema
} from "@/lib/perusahaan_asuransi/types";
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";


export type ReturnState = ActionReturnState<PerusahaanReturnResult>;

export async function updatePerusahaanAction(
  id: string,
  prevState: ReturnState,
  formData: FormData
): Promise<ReturnState> {
  const supabase = await createClient();

  const formValues = Object.fromEntries(formData.entries());
  const parsed = perusahaanUpdateFormSchema.safeParse({
    ...formValues, id
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
    };
  }

  const {nama, email, alamat, kontak_1, kontak_2} = parsed.data;

  const {data, error} = await supabase.rpc('perusahaan_asuransi_update_v1', {
    p_id: id,
    p_nama: nama,
    p_email: email,
    p_alamat: alamat,
    p_kontak_1: kontak_1,
    p_kontak_2: kontak_2
  });

  if(error){
    return {
      success: false,
      message: error.message
    }
  }

  return{
    success: true,
    message: `Berhasil Update Perusahaan ${data[0].nama_asuransi}`
  }
}