import { useForm } from "react-hook-form";
import {z} from "zod";

const addPembayaranPremiFormSchema = z.object({
    id: z.string().uuid(),
    tanggal_bayar: z.date(),
    nominal: z.coerce.number().min(1, "Nominal wajib diisi"),
    cara_bayar: z.enum(["cash", "transfer","virtual account"]),
    ref_no: z.string().min(1, "Ref No wajib diisi"),
    rekening_bank: z.string().nullable().optional(),
});

export type AddPembayaranPremiForm = z.infer<typeof addPembayaranPremiFormSchema>;

export default function AddPembayaranPremiForm({id}: {id: string}) {

    const method = useForm<AddPembayaranPremiForm>({
        
    })

    return (
        <div>
            <h1>{`Form Pembayaran Premi ${id}`}</h1>
        </div>
    );
}