'use client';
import { useActionState, useEffect } from "react";
import {
    perusahaanFormSchema,
    defaultPerusahaanForm,
    type PerusahaanForm
} from "@/lib/perusahaan_asuransi/types";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextField from "@/components/TextField";
import { createPerusahaan, type ReturnState } from "./actions/createAction";
import { Button } from "@/components/button";

export default function CreatePerusahaanForm() {

    const method = useForm<PerusahaanForm>({
        mode: 'all',
        resolver: zodResolver(perusahaanFormSchema),
        defaultValues: defaultPerusahaanForm
    });

    const [state, formAction, isPending] = useActionState<ReturnState, FormData>(createPerusahaan, { success: false, message: "" });

    const handleReset = () => {
        method.reset(defaultPerusahaanForm);
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

                <FormTextField<PerusahaanForm>
                    name='nama'
                    label="Nama Asuransi"
                />
                <FormTextField<PerusahaanForm>
                    name='email'
                    label="Email"
                />
                <FormTextField<PerusahaanForm>
                    name='alamat'
                    label="Alamat Perusahaan"
                />
                <FormTextField<PerusahaanForm>
                    name='kontak_1'
                    label="Kontak 1"
                />
                <FormTextField<PerusahaanForm>
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