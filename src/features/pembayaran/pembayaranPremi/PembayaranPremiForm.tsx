'use client';
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import FormDateField from "@/components/DateField";
import { SelectField } from "@/components/SelectField";
import FormTextField from "@/components/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useActionState } from "react";
import { addPembayaranAction } from "./actions/addPembayaranPremi";
import {
    addPembayaranPremiFormSchema,
    defaultAddPembayaranPremiForm,
    cara_bayar,
    type AddPembayaranPremiForm
} from "@/lib/pembayaran/pembayaran_premi/types";
import updatePembayaranAction from "./actions/updatePembayaranAction";

type PembayaranPremiFormProps = {
    id: string;
    onSuccess: () => void;
    updateValues?: AddPembayaranPremiForm;
};

export default function PembayaranPremiForm({
    id,
    onSuccess,
    updateValues
}: PembayaranPremiFormProps) {

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [state, formAction, isPending] = useActionState(
        updateValues ?
            updatePembayaranAction.bind(null, id) :
            addPembayaranAction.bind(null, id),
        {
            success: false,
            message: ""
        }
    );

    const methods = useForm<AddPembayaranPremiForm>({
        mode: 'all',
        resolver: zodResolver(addPembayaranPremiFormSchema),
        defaultValues: updateValues || defaultAddPembayaranPremiForm,
    });

    useEffect(() => {
        if (state.success) {
            onSuccess();
        }
    }, [state, onSuccess]);

    useEffect(() => {
        if (updateValues) {
            methods.reset(updateValues);
        }
    }, [updateValues, methods]);

    const handleReview = async () => {
        const isValid = await methods.trigger();
        if (isValid) {
            setShowConfirmation(true);
        }
    };

    const formData = methods.watch();

    if (showConfirmation) {
        return (
            <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">Konfirmasi Pembayaran</h3>
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
                        <span className="font-medium">{formData.ref_no}</span>
                    </div>
                    {formData.rekening_bank && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Rekening Bank:</span>
                            <span className="font-medium">{formData.rekening_bank}</span>
                        </div>
                    )}
                </div>

                <form action={formAction} className="mt-6 space-y-4">
                    {/* Hidden inputs to pass data to server action */}
                    <input type="hidden" {...methods.register('tanggal_bayar')} />
                    <input type="hidden" {...methods.register('amount_paid')} />
                    <input type="hidden" {...methods.register('cara_bayar')} />
                    <input type="hidden" {...methods.register('ref_no')} />
                    <input type="hidden" {...methods.register('rekening_bank')} />

                    <Button
                        type="submit"
                        disabled={isPending}
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
        <FormProvider {...methods}>
            <div className="space-y-4">
                <FormDateField<AddPembayaranPremiForm>
                    name='tanggal_bayar'
                    label="Tanggal Bayar"
                />
                <FormTextField<AddPembayaranPremiForm>
                    name='amount_paid'
                    label="amount_paid"
                    type="number"
                />
                <SelectField<AddPembayaranPremiForm>
                    name='cara_bayar'
                    label="Cara Bayar"
                    options={cara_bayar}
                />
                <FormTextField<AddPembayaranPremiForm>
                    name='ref_no'
                    label="Ref No"
                />
                <FormTextField<AddPembayaranPremiForm>
                    name='rekening_bank'
                    label="Rekening Bank (Opsional)"
                />
                <Button
                    type='button'
                    onClick={handleReview}
                    className='mt-4 w-full'
                >
                    Tambah Pembayaran
                </Button>

                {!methods.formState.isValid && methods.formState.isSubmitted && (
                    <p className="mt-2 text-sm text-red-600">Harap periksa kembali data yang Anda masukkan.</p>
                )}
            </div>
        </FormProvider>
    );
}