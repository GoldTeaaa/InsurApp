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
import createNasabahAction from "./actions/create-form";
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
        if (tipe === 'perusahaan') {
            method.reset({ ...defaultPerusahaanFormValues, tipe: 'perusahaan' });
        } else {
            method.reset({ ...defaultPribadiFormValues, tipe: 'pribadi' });
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
            const base = data.tipe === 'perusahaan' ? defaultPerusahaanFormValues : defaultPribadiFormValues;
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
                onSubmit={method.handleSubmit(submit)}
                aria-busy={isSubmitting}
                className="
                    mx-auto mt-8
                    w-full max-w-2xl md:max-w-3xl
                    rounded-xl border border-gray-200/80 bg-white/90 p-4 sm:p-6
                    shadow-sm backdrop-blur
                    focus-within:ring-2 focus-within:ring-indigo-500/30
                    transition-shadow
                    "
            >
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Buat Nasabah</h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Pilih tipe nasabah lalu lengkapi detail di bawah.
                    </p>
                </div>

                {/* Alerts */}
                {!!method.formState.errors.root?.message && (
                    <div
                        role="alert"
                        className="
                            mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700
                        "
                    >
                        {method.formState.errors.root.message}
                    </div>
                )}

                {!!returnMessage && (
                    <div
                        role="status"
                        className="
                            mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700
                        "
                    >
                        {returnMessage}
                    </div>
                )}

                {/* Card: Tipe + Placeholder for form sections */}
                <div className="
                        rounded-lg border border-gray-200 bg-white
                        px-3 py-3 sm:px-4 sm:py-4"
                >
                    {/* Tipe selector */}
                    <div className="mb-4">
                        <div className="mb-1.5 text-s font-medium text-gray-600">Tipe Nasabah</div>
                        <RadioField<NasabahForm>
                            name="tipe"
                            label=""
                            options={TIPE}
                        />
                    </div>

                    {/* Dynamic form area */}
                    <div className="mt-4 grid grid-cols-1 gap-4">
                        {tipe === 'pribadi' && <PribadiForm />}
                        {tipe === 'perusahaan' && <PerusahaanForm />}
                    </div>
                </div>

                {/* Button */}
                <div
                    className="
                        mt-5 sm:mt-6
                        flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end
                        border-t border-gray-100 pt-4
                    "
                >
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="
                            w-full sm:w-auto
                            inline-flex items-center justify-center
                            px-4 py-2.5
                            text-sm font-medium
                            rounded-lg
                            transition
                            disabled:opacity-60
                        "
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}