'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    TIPE,
    defaultPribadiFormValues,
    formSchema,
    type NasabahForm,
    defaultPerusahaanFormValues,
} from "@/lib/nasabah/type";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioField } from "@/components/RadioField";
import PribadiForm from "./NasabahPribadiForm";
import PerusahaanForm from "./NasabahPerusahaanForm";
import { Button } from "@/components/button";
import createNasabahAction from "@/features/nasabah/actions/createNasabah";
import updateNasabahAction from "@/features/nasabah/actions/updateNasabah";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";

type CreateFormProps = {
    mode: "create";
};

type UpdateFormProps = {
    mode: "update";
    id: string;
    initialData: NasabahForm;
};

export type NasabahFormProps = CreateFormProps | UpdateFormProps;

export default function NasabahForm(props: NasabahFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mode } = props;

    const updateId = mode === "update" ? props.id : "";
    const initialData = mode === "update" ? props.initialData : defaultPribadiFormValues;

    const methods = useForm<NasabahForm>({
        mode: "all",
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
        shouldUnregister: false
    });

    const {
        control,
        reset,
        clearErrors,
        setError,
        handleSubmit,
        formState: { isDirty, errors, isSubmitting: isFormSubmitting }
    } = methods;

    const tipe = useWatch({
        control,
        name: "tipe"
    });

    useEffect(() => {
        // This effect should only run in 'create' mode to avoid overwriting initialData on update.
        if (mode === 'update') return;

        if (tipe === 'perusahaan') {
            reset({ ...defaultPerusahaanFormValues, tipe: 'perusahaan' });
        } else {
            reset({ ...defaultPribadiFormValues, tipe: 'pribadi' });
        }
    }, [tipe, mode, reset]);

    const submit = async (data: NasabahForm) => {
        try {
            setIsSubmitting(true);
            clearErrors('root');

            const res = mode === 'create'
                ? await createNasabahAction(data)
                : await updateNasabahAction({
                    id: updateId,
                    formData: data
                });

            if (!res.success) {
                setError('root', { message: res.message ?? 'Gagal menyimpan' });
            } else {
                router.back();
                toast.success(res.message);
            }
        } catch (e) {
            setError('root', { message: (e as Error).message ?? 'Gagal menyimpan' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(submit)}
                aria-busy={isSubmitting}
                className="mx-auto mt-8 w-full max-w-2xl md:max-w-3xl rounded-xl bg-white/90 p-4 sm:p-6 shadow-sm backdrop-blur focus-within:ring-2 focus-within:ring-indigo-500/30 transition-shadow"
            >
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {mode === 'create' ? 'Tambah Nasabah' : 'Update Nasabah'}
                    </h2>
                </div>

                {/* Alerts */}
                {!!errors.root?.message && (
                    <div
                        role="alert"
                        className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                    >
                        {errors.root.message}
                    </div>
                )}

                {/* Card: Tipe + Placeholder for form sections */}
                <div className="rounded-lg bg-white px-3 py-3 sm:px-4 sm:py-4">

                    <div className="mb-4">
                        {mode === 'update'
                            ? <div className="text-xs text-red-500">Tipe nasabah tidak dapat diubah saat update.</div>
                            : <div className="mb-1.5 text-s font-medium text-gray-600">Tipe Nasabah</div>
                        }
                        <RadioField<NasabahForm>
                            name="tipe"
                            label=""
                            options={TIPE}
                            disabled={mode === 'update'}
                        />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                        {tipe === 'pribadi' && <PribadiForm />}
                        {tipe === 'perusahaan' && <PerusahaanForm />}
                    </div>
                </div>

                {/* Button */}
                <div className="mt-5 sm:mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end border-t border-gray-100 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Kembali
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || isFormSubmitting || (mode === 'update' && !isDirty)}
                        className="flex items-center gap-2"
                    >
                        <Save />
                        {isSubmitting ? 'Menyimpan...' : (mode === 'create' ? 'Simpan' : 'Update')}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}