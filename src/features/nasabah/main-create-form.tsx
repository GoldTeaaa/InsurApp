'use client';
import { useEffect, useState } from "react";
import {
    TIPE,
    defaultPribadiFormValues,
    formSchema,
    type NasabahForm,
    defaultPerusahaanFormValues
} from "@/lib/nasabah/type";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioField } from "@/components/RadioField";
import PribadiForm from "./form/pribadi-form";
import PerusahaanForm from "./form/perusahaan-form";
import { createNasabahAction } from "./actions/create-form";
import { Button } from "@/components/button";

export default function CreateNasabahForm() {
    const method = useForm<NasabahForm>({
        mode: "all",
        resolver: zodResolver(formSchema),
        defaultValues: defaultPribadiFormValues,
        shouldUnregister: false
    });

    const tipe = useWatch({
        control: method.control,
        name: "tipe"
    });

    useEffect(() => {
        if (tipe === 'Perusahaan') {
            method.reset({ ...defaultPerusahaanFormValues, tipe: 'Perusahaan' });
        } else {
            method.reset({ ...defaultPribadiFormValues, tipe: 'Pribadi' });
        }
    }, [tipe]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [returnMessage, setReturnMessage] = useState('');

    useEffect(() => {
        if (returnMessage) {
            const timer = setTimeout(() => {
                setReturnMessage('');
            }, 5000); // 5 seconds

            return () => clearTimeout(timer);
        }
    }, [returnMessage]);

    const submit = async (data: NasabahForm) => {
        try {
            setIsSubmitting(true);
            const res = await createNasabahAction(data);
            if (!res.success) {
                method.setError('root', { message: res.message ?? 'Gagal menyimpan' });
            }
            const base = data.tipe === 'Perusahaan' ? defaultPerusahaanFormValues : defaultPribadiFormValues;
            method.reset(base);
            setReturnMessage(res.message);
        } catch (e) {
            method.setError('root', { message: 'Terjadi kesalahan pada server' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <FormProvider {...method}>
            <form
                className="max-w-xl mx-auto mt-8 space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                onSubmit={method.handleSubmit(submit)}
            >
                <div>
                    <RadioField<NasabahForm> // Tipe Radio Button
                        name='tipe'
                        label='Tipe Nasabah'
                        options={TIPE}
                    />
                </div>
                {tipe === 'Pribadi' && <PribadiForm />}
                {tipe === 'Perusahaan' && <PerusahaanForm />}
                <Button type="submit">
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
                {returnMessage && <p className="text-sm text-green-600">{returnMessage}</p>}
            </form>
        </FormProvider>
    );
}