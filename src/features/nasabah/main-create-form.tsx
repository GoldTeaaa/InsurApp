import {
    defaultNasabahFormValues,
    formSchema,
    type NasabahForm
} from "@/lib/nasabah/type";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateNasabahForm() {
    const method = useForm<NasabahForm>({
        mode: "all",
        resolver: zodResolver(formSchema),
        defaultValues: defaultNasabahFormValues
    });

    return (
        <FormProvider {...method}>
            <div>
                
            </div>
        </FormProvider>
    );
}