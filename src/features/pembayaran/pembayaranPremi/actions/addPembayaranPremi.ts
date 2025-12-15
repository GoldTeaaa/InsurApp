'use server';
import { 
    addPembayaranPremiFormSchema, 
    addPembayaranPremiPayloadSchema 
} from "@/lib/pembayaran/pembayaran_premi/types";
import { createClient } from "~/utils/supabase/server";

type State = {
    success: boolean;
    message: string;
};

export async function addPembayaranAction(
    id: string,
    prevState: State,
    formData: FormData
): Promise<State> {
    const supabase = await createClient();
    const validatedFields = addPembayaranPremiFormSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return { 
            success: false, 
            message: "Validasi gagal. Periksa kembali isian Anda." 
        };
    }

    const payload = addPembayaranPremiPayloadSchema.parse({
        detail_premi_id: id,
        ...validatedFields.data,
    });

    console.log("FROM SERVER PAYLOAD:", payload);
    // Here you would add your database logic, e.g., await db.insert(...)

    const {data, error} = await supabase.rpc('pembayaran_premi',{
        p_detail_premi_id : payload.detail_premi_id,
        p_amount_paid : payload.amount_paid,
        p_tanggal_bayar : payload.tanggal_bayar,
        p_cara_bayar : payload.cara_bayar,
        p_ref_no : payload.ref_no,
        p_rekening_bank : payload.rekening_bank
    })

    if(error){
        return {
            success: false,
            message: error.message,
        }
    }

    return {
        success: true,
        message: "Pembayaran berhasil ditambahkan.",
    };
}