'use client';
import { useActionState, useEffect } from "react";
import {
    perusahaanCreateFormSchema,
    defaultPerusahaanCreateForm,
    type PerusahaanCreateForm
} from "@/lib/perusahaan_asuransi/types";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextField from "@/components/TextField";
import { createPerusahaan, type CreateState } from "./actions/createAction";
import { Button } from "@/components/button";

export default function CreatePerusahaanForm() {

    const method = useForm<PerusahaanCreateForm>({
        mode: 'all',
        resolver: zodResolver(perusahaanCreateFormSchema),
        defaultValues: defaultPerusahaanCreateForm
    });

    const [state, formAction, isPending] = useActionState<CreateState, FormData>(createPerusahaan, { success: false, message: "" });

    const handleReset = () => {
        method.reset(defaultPerusahaanCreateForm);
    }

    useEffect(() => {
        if (state.success) {
            method.reset();
        }
    }, [state, method]);

    return (
        <FormProvider {...method}>
            <form action={formAction} className="max-w-xl mx-auto mt-8 space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Tambah Perusahaan Asuransi</h2>

                <FormTextField<PerusahaanCreateForm>
                    name='nama'
                    label="Nama Asuransi"
                />
                <FormTextField<PerusahaanCreateForm>
                    name='email'
                    label="Email"
                />
                <FormTextField<PerusahaanCreateForm>
                    name='alamat'
                    label="Alamat Perusahaan"
                />
                <FormTextField<PerusahaanCreateForm>
                    name='kontak_1'
                    label="Kontak 1"
                />
                <FormTextField<PerusahaanCreateForm>
                    name='kontak_2'
                    label="Kontak 2"
                />

                <div className="pt-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                    <Button onClick={handleReset}>
                        Reset
                    </Button>
                </div>

                {state.message && (
                    <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                        {state.message}
                    </p>
                )}
            </form>
        </FormProvider>
    );
}