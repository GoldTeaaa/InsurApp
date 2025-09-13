'use client';
import {
    defaultNasabahFormValues,
    formSchema,
    type NasabahForm
} from "@/lib/nasabah/type";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioField } from "@/components/RadioField";
import PribadiForm from "./form/pribadi-form";
import PerusahaanForm from "./form/perusahaan-form";

export default function CreateNasabahForm() {
    const method = useForm<NasabahForm>({
        mode: "all",
        resolver: zodResolver(formSchema),
        defaultValues: defaultNasabahFormValues
    });
    

    const tipe = useWatch({
        control: method.control,
        name: "tipe"
    })

    return (
        <FormProvider {...method}>
            <div>
                <RadioField<NasabahForm>
                    name='tipe'
                    label='Tipe Nasabah'
                    options={['pribadi', 'perusahaan']}
                />
            </div>
            {tipe === 'pribadi' && <PribadiForm/>}
            {tipe === 'perusahaan' && <PerusahaanForm/>}
        </FormProvider>
    );
}