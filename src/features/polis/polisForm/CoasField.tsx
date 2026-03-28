import { PlusIcon } from "lucide-react";
import PremiKomisiBox from "./PremiKomisiBox";
import { PolisCoas } from "@/features/polis/schema/create-types";
import { getDefaultValues } from "@/features/polis/schema/defaultValues";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ListPerusahaanType } from "@/features/polis/schema/step3";

export default function CoasFields({ perusahaanList }: { perusahaanList: ListPerusahaanType[] }) {
    const {
        control,
        setValue
    } = useFormContext<PolisCoas>(); // Use the specific PolisCoas type here

    const { append, remove, fields } = useFieldArray({
        control: control,
        name: 'shares',
    });

    // Automatically set the coas_role based on the index.  
    useEffect(() => {
        fields.forEach((_field, index) => {
            setValue(`shares.${index}.coas_role`, index === 0 ? 'leader' : 'member');
        });
    }, [fields, setValue]);

    const handleAddShare = () => {
        const newShare = getDefaultValues("non-coas").shares;
        append({ ...newShare, persentase_share: 0 });
    };

    return (
        <div className="space-y-4 animate-in fade-in-0">
            {fields.map((field, index) => (
                <PremiKomisiBox
                    key={field.id}
                    baseName={`shares.${index}`}
                    perusahaanList={perusahaanList}
                    onRemove={() => remove(index)}
                />
            ))}
            <button
                type="button"
                onClick={handleAddShare}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-all hover:border-sky-500 hover:bg-sky-50 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
                <PlusIcon className="h-5 w-5" />
                Tambah Share
            </button>
        </div>
    );
}