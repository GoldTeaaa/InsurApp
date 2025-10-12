'use client';
import { GetPolisSchema } from "@/lib/polis/get-types";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import DetailPolis from "./BasePolis/DetailPolis";
import DetailSharePolis from "./SharePolis/DetailSharePolis";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation"; 

export default function EditPolisForm({ data }: { data: GetPolisSchema }) {
    const router = useRouter();

    const methods = useForm<GetPolisSchema>({
        defaultValues: data
    });

    const { formState: { isDirty } } = methods;
    console.log("isDirty: ", isDirty);

    const onSubmit: SubmitHandler<GetPolisSchema> = (formData) => {
        // TODO: Implement your save logic here
        console.log("Form data to save:", formData);
        alert("Check the console for the form data.");
    };

    const handleCancel = () => {
        // TODO: Implement cancel logic, e.g., navigate back
        router.back();
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
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