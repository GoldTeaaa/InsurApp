"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

type ReturnState = {
  success: boolean;
  message: string;
};

export default async function deletePembayaranKomisi(
  deletePembayaranKomisiId: string,
  prevState: ReturnState,
  formData: FormData
): Promise<ReturnState> {
  const { data, error } = await supabase.rpc("delete_pembayaran_komisi", {
    p_pembayaran_komisi_id: deletePembayaranKomisiId,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard/pembayaran/komisi");
  return {
    success: true,
    message: "Berhasil menghapus pembayaran komisi",
  };
}
