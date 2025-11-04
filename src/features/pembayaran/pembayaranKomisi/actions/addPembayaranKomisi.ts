'use server';
import { PayloadPembayaranKomisiFormSchema } from "@/lib/pembayaran/pembayaran_komisi/types";
import { supabase } from "@/lib/supabase";
import { ActionReturnState } from "@/lib/types";

// Set to correct return type if determined
type ReturnState = ActionReturnState<unknown>;

export default async function addPembayaranKomisi(
    detailKomisiId: string,
    prevState: ReturnState,
    formData: FormData
): Promise<ReturnState> {
    const validatedFields = PayloadPembayaranKomisiFormSchema.safeParse({
        detail_komisi_id: detailKomisiId,
        ...Object.fromEntries(formData),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.message
        };
    }

    const { data, error } = await supabase.rpc('komisi_payment', {
        p_detail_komisi_id: detailKomisiId,
        p_amount_paid: validatedFields.data.amount_paid,
        p_tanggal_bayar: validatedFields.data.tanggal_bayar,
        p_cara_bayar: validatedFields.data.cara_bayar,
        p_no_kwitansi: validatedFields.data.no_kwitansi,
        p_rekening_bank: validatedFields.data.rekening_bank
    })

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "Berhasil menambahkan pembayaran komisi"
    }
}