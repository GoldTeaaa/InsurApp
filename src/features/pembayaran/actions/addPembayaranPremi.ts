'use server';
import { 
    addPembayaranPremiFormSchema, 
    addPembayaranPremiPayloadSchema 
} from "@/lib/pembayaran/pembayaran_premi/types";

type State = {
    success: boolean;
    message: string;
};

export async function addPembayaranAction(
    id: string,
    prevState: State,
    formData: FormData
): Promise<State> {
    console.log("formData: ", Object.fromEntries(formData.entries()));
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
        id: id,
        ...validatedFields.data,
    });

    console.log("FROM SERVER PAYLOAD:", payload);
    // Here you would add your database logic, e.g., await db.insert(...)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        success: true,
        message: "Pembayaran berhasil ditambahkan.",
    };
}