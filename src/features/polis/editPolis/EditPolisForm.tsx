'use client';
import { GetPolisSchema, RefinedViewPolisSchema } from "@/lib/polis/get-types";
import { FormProvider, useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import DetailPolis from "./BasePolis/DetailPolis";
import DetailSharePolis from "./SharePolis/DetailSharePolis";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import ErrorToast from "@/features/polis/polisForm/ErrorToast";
import updatePolis from "../actions/updatePolis";

const BasePolisField = {
    fields: [
        'nomor_polis',
        'id_nasabah',
        'jenis_coas',
        'bisnis',
        'total_sum_insured',
        'nilai_rate',
        'jenis_rate',
        'total_premi',
        'periode_mulai',
        'periode_akhir',
        'shares'
    ]
}

export default function EditPolisForm({ data }: { data: GetPolisSchema }) {
    const router = useRouter();
    const [toastErrors, setToastErrors] = useState<FieldErrors<GetPolisSchema> | null>(null);

    const methods = useForm<GetPolisSchema>({
        resolver: zodResolver(RefinedViewPolisSchema),
        defaultValues: data,
    });

    const {
        formState: { isDirty, errors }
    } = methods;

    const onSubmit: SubmitHandler<GetPolisSchema> = async (formData) => { 
        console.log("Form data to save:", formData);

        const res = await updatePolis(formData);
        if(!res.success){
            return;
        }

        router.push('/dashboard/polis');
    };

    // This function is called if validation fails
    const onInvalid = (errors: FieldErrors<GetPolisSchema>) => {
        console.log("Validation failed:", errors);
        setToastErrors(errors);
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <FormProvider {...methods}>
            <ErrorToast errors={toastErrors} onClose={() => setToastErrors(null)} />
            <form
                onSubmit={methods.handleSubmit(onSubmit, onInvalid)}
                className="max-w-6xl mx-auto mt-8 space-y-6"
            >
                <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <DetailPolis />
                    <DetailSharePolis />
                </div>
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isDirty}
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}