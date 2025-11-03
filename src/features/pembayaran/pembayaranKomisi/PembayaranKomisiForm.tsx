'use client';
import { 
    defaultValuePembayaranKomisiForm, 
    HistoryPembayaranKomisiTableRow, 
    PembayaranKomisiFormSchema,  
    type PembayaranKomisiForm 
} from "@/lib/pembayaran/pembayaran_komisi/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import BasePembayaranKomisiForm from "./BasePembayaranKomisiForm";
import { Button } from "@/components/button";
import { useActionState, useState, useEffect } from "react";
import addPembayaranKomisi from "./actions/addPembayaranKomisi";
import { useRouter } from "next/navigation";
import updatePembayaranKomisi from "./actions/updatePembayaranKomisi";

type PembayaranKomisiFormProps = {
    mode: "add" | "edit";
    pembayaranKomisiId?: string;
    detailKomisiId?: string;
    updateValues?: HistoryPembayaranKomisiTableRow;
    onAddSuccess: () => void;
}

export default function PembayaranKomisiForm({
    mode,
    pembayaranKomisiId,
    detailKomisiId,
    updateValues,
    onAddSuccess
}: PembayaranKomisiFormProps) {
    console.log("updateValues: ", updateValues);

    const router = useRouter();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const initialUpdateValues = PembayaranKomisiFormSchema.safeParse(updateValues);

    // TODO: Update with more grace error handling
    if(!initialUpdateValues.success) {
        console.error(initialUpdateValues.error);
    }

    const method = useForm<PembayaranKomisiForm>({
        mode: "all",
        resolver: zodResolver(PembayaranKomisiFormSchema),
        defaultValues: initialUpdateValues.data ?? defaultValuePembayaranKomisiForm
    });

    const {
        formState: { isDirty },
        trigger,
    } = method;

    const [state, formAction, isPending] = useActionState(
        mode === "add" ? 
        addPembayaranKomisi.bind(null, detailKomisiId ? detailKomisiId : "") 
        : updatePembayaranKomisi.bind(null, pembayaranKomisiId ?? ""),
        {
            success: false,
            message: ""
        }
    )

    useEffect(() => {
        if (state.success) onAddSuccess();
    }, [state.success, onAddSuccess, router]);

    const handleReview = async () => {
        const isValid = await trigger();
        if (isValid) {
            setShowConfirmation(true);
        }
    };

    const formData = method.watch();

    if (showConfirmation) {
        return (
            <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">Konfirmasi
                    <span className="text-blue-600">{mode === "edit" ? " Edit " : " Tambah "}</span>
                     Pembayaran
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal Bayar:</span>
                        <span className="font-medium">{formData.tanggal_bayar.toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Nominal:</span>
                        <span className="font-medium">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(formData.amount_paid)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Cara Bayar:</span>
                        <span className="font-medium">{formData.cara_bayar}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">No. Referensi:</span>
                        <span className="font-medium">{formData.no_kwitansi}</span>
                    </div>
                    {formData.rekening_bank && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Rekening Bank:</span>
                            <span className="font-medium">{formData.rekening_bank}</span>
                        </div>
                    )}
                </div>

                <form action={formAction} className="mt-6 space-y-4">
                    <input type="hidden" {...method.register('tanggal_bayar')} />
                    <input type="hidden" {...method.register('amount_paid')} />
                    <input type="hidden" {...method.register('cara_bayar')} />
                    <input type="hidden" {...method.register('no_kwitansi')} />
                    <input type="hidden" {...method.register('rekening_bank')} />

                    <Button
                        type="submit"
                        disabled={isPending || !isDirty}
                        className="w-full"
                    >
                        {isPending ? 'Menyimpan...' : 'Konfirmasi & Simpan'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowConfirmation(false)}
                        disabled={isPending}
                        className="w-full"
                    >
                        Edit Kembali
                    </Button>
                    {state.message && !state.success && (
                        <p className="mt-2 text-sm text-red-600">{state.message}</p>
                    )}
                </form>
            </div>
        );
    }

    return (
        <FormProvider {...method}>
            <div className="space-y-4">
                <BasePembayaranKomisiForm />
                <Button
                    disabled={!isDirty || isPending}
                    type="button"
                    onClick={handleReview}
                    className="w-full"
                >
                    {isPending ? "Menyimpan..." : (mode === "add" ? "Tambah Pembayaran" : "Edit Pembayaran")}
                </Button>
            </div>
        </FormProvider>
    );
}