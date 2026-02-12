"use server";

import {
  updatePembayaranFormSchema,
  updatePembayaranPremiPayloadSchema,
} from "@/lib/pembayaran/pembayaran_premi/types";
import { createClient } from "~/utils/supabase/server";

type State = {
  success: boolean;
  message: string;
};

export default async function updatePembayaranAction(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const supabase = await createClient();
  const validatedFields = updatePembayaranFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali isian Anda.",
    };
  }

  // The detailPremiId is retrieved inside the RPC
  const payload = updatePembayaranPremiPayloadSchema.parse({
    pembayaran_premi_id: id,
    ...validatedFields.data,
  });

  const { error } = await supabase.rpc("update_pembayaran_premi", {
    p_pembayaran_premi_id: payload.pembayaran_premi_id,
    p_amount_paid: payload.amount_paid,
    p_tanggal_bayar: payload.tanggal_bayar,
    p_cara_bayar: payload.cara_bayar,
    p_ref_no: payload.ref_no,
    p_rekening_bank: payload.rekening_bank,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Pembayaran updated successfully.",
  };
}
