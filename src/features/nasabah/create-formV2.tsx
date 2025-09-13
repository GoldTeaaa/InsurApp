import { FormProvider, useForm } from "react-hook-form";

export default function CreateNasabahForm() {
    const method = useForm(

    );

    return (
        <FormProvider {...method}>
            <form action="">
                <FormTextField
                    
                />
            </form>
        </FormProvider>
    );
}