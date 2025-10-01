import { Polis, PolisCoas, getDefaultValues } from "@/lib/polis/types";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { PlusIcon } from "@heroicons/react/24/outline";
import PremiInputBox from "./PremiInputBox";
import TotalPremiDisplay from "./TotalPremiDisplay";

function CoasFields() {
    const {
        control,
        formState: { errors },
    } = useFormContext<PolisCoas>(); // Use the specific PolisCoas type here

    const { append, remove, fields } = useFieldArray({
        control: control,
        name: 'shares',
    });

    const handleAddShare = () => {
        // Get a single default share from the "non-coas" default values
        const newShare = getDefaultValues("non-coas").shares;
        append(newShare);
    };

    return (
        <div className="space-y-4 animate-in fade-in-0">
            {fields.map((field, index) => (
                <PremiInputBox
                    key={field.id}
                    baseName={`shares.${index}`}
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

export default function Step3() {
    const { control } = useFormContext<Polis>();

    const jenisCoas = useWatch({
        control,
        name: "jenis_coas",
    });

    const showCoasFields = jenisCoas === "coas";

    return (
        <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
                Detail Premi & Share Polis{' '}
                <span className="font-bold text-sky-600">{showCoasFields ? "Coas" : "Non-Coas"}</span>
            </h2>
            {/* TotalPremiDisplay is relevant for both coas and non-coas, so it's moved outside the conditional. */}
            <TotalPremiDisplay />
            <div className="space-y-4">
                {showCoasFields ? (
                    <CoasFields />
                ) : (
                    <PremiInputBox baseName="shares" />
                )}
            </div>
        </section>
    );
}