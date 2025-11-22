"use server";
import { UpdatePembayaranKomisiFormSchema } from "@/lib/pembayaran/pembayaran_komisi/types";
import { supabase } from "~/utils/supabase/client";

type ReturnState = {
  success: boolean;
  message: string;
};

export default async function updatePembayaranKomisi(
  pembayaranKomisiId: string,
  prevState: ReturnState,
  formData: FormData
): Promise<ReturnState> {
  const validatedFields = UpdatePembayaranKomisiFormSchema.safeParse({
    pembayaran_komisi_id: pembayaranKomisiId,
    ...Object.fromEntries(formData),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.message,
    };
  }
  const {
    pembayaran_komisi_id,
    amount_paid,
    tanggal_bayar,
    cara_bayar,
    no_kwitansi,
    rekening_bank,
  } = validatedFields.data;

  const { data, error } = await supabase.rpc("update_pembayaran_komisi", {
    p_pembayaran_komisi_id: pembayaran_komisi_id,
    p_amount_paid: amount_paid,
    p_tanggal_bayar: tanggal_bayar,
    p_cara_bayar: cara_bayar,
    p_no_kwitansi: no_kwitansi,
    p_rekening_bank: rekening_bank,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Success",
  };
}
