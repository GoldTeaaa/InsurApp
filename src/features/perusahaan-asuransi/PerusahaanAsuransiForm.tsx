'use client';
import { useActionState, useEffect, useTransition } from "react";
import {
    perusahaanFormSchema,
    defaultPerusahaanForm,
    type PerusahaanFormType
} from "@/lib/perusahaan_asuransi/types";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextField from "@/components/TextField";
import { createPerusahaan, type ReturnState } from "./actions/createPerusahaan";
import { Button } from "@/components/button";
import Link from "next/link";
import { toast } from "sonner";
import { updatePerusahaanAction } from "./actions/updatePerusahaan";
import { useRouter } from "next/navigation";

type PerusahaanFormProps = | {
    mode: "create";
    id?: never;
    prefillData?: never;
} | {
    mode: "update";
    id: string;
    prefillData: PerusahaanFormType;
}

export default function PerusahaanFormType({
    mode,
    id,
    prefillData
}: PerusahaanFormProps) {
    const defaultValues = prefillData || defaultPerusahaanForm;
    const router = useRouter();

    const method = useForm<PerusahaanFormType>({
        mode: 'all',
        resolver: zodResolver(perusahaanFormSchema),
        defaultValues: defaultValues
    });

    const { handleSubmit } = method;

    const action = mode === "create" ? createPerusahaan : updatePerusahaanAction.bind(null, id);

    const [state, formAction, isPending] = useActionState<ReturnState, FormData>(action, {
        success: false,
        message: ""
    });
    const [isTransitioning, startTransition] = useTransition();

    // const handleReset = () => { 
    //     method.reset(defaultPerusahaanForm);
    // }

    useEffect(() => {
        if (state.success) {
            router.back();
            toast.success(state.message);
        }
    }, [state, method, router]);

    return (
        <FormProvider {...method}>
            <form
                onSubmit={handleSubmit((data) => {
                    const formData = new FormData();
                    Object.entries(data).forEach(([key, value]) => formData.append(key, value as string));
                    startTransition(() => {
                        formAction(formData);
                    });
                })}
                className="max-w-xl mx-auto mt-8 space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">{mode === "create" ? "Tambah Perusahaan Asuransi" : "Update Perusahaan Asuransi"}</h2>

                <FormTextField<PerusahaanFormType>
                    name='nama'
                    label="Nama Asuransi"
                />
                <FormTextField<PerusahaanFormType>
                    name='email'
                    label="Email"
                />
                <FormTextField<PerusahaanFormType>
                    name='alamat'
                    label="Alamat Perusahaan"
                />
                <FormTextField<PerusahaanFormType>
                    name='kontak_1'
                    label="Kontak 1"
                />
                <FormTextField<PerusahaanFormType>
                    name='kontak_2'
                    label="Kontak 2"
                />

                <div className="pt-2 flex gap-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                    <Button onClick={() => router.back()} variant="ghost">
                        Cancel
                    </Button>
                </div>

                {(!state.success && state.message) && (
                    <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                        {state.message}
                    </p>
                )}
            </form>
        </FormProvider>
    );
}