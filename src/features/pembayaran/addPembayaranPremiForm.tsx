'use client';
import { useEffect } from "react";
import { Button } from "@/components/button";
import FormDateField from "@/components/DateField";
import {SelectField} from "@/components/SelectField";
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

export default function AddPembayaranPremiForm({ id }: { id: string }) {

    const [state, formAction, isPending] = useActionState(addPembayaranAction.bind(null, id), { success: false, message: "" });

    const methods = useForm<AddPembayaranPremiForm>({
        mode: 'all',
        resolver: zodResolver(addPembayaranPremiFormSchema),
        defaultValues: defaultAddPembayaranPremiForm,
    });

    useEffect(() => {
        if (state.success) {
            methods.reset(defaultAddPembayaranPremiForm);
        }
    }, [state, methods]);

    return (
        <FormProvider {...methods}>
            <form action={formAction} className="space-y-4">
                <FormDateField<AddPembayaranPremiForm>
                    name='tanggal_bayar'
                    label="Tanggal Bayar"
                />
                <FormTextField<AddPembayaranPremiForm>
                    name='nominal'
                    label="Nominal"
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
                <Button type='submit' disabled={isPending} className='mt-4 w-full'>
                    {isPending ? 'Menyimpan...' : 'Tambah Pembayaran'}
                </Button>

                {state.message && !state.success && (
                    <p className="mt-2 text-sm text-red-600">{state.message}</p>
                )}
            </form>
        </FormProvider>
    );
}