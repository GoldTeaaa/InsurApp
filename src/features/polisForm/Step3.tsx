import FormTextField from "@/components/TextField";
import { Polis } from "@/lib/polis/types";
import { useFormContext, useWatch } from "react-hook-form";
import PremiInputBox from "./PremiInputBox";
import TotalPremiDisplay from "./TotalPremiDisplay";

export default function Step3() {
    const { control } = useFormContext<Polis>();

    const jenisCoas = useWatch({
        control,
        name: "jenis_coas",
    });

    // We show the co-insurance fields only when the type is "coas"
    const showCoasFields = jenisCoas === "coas";

    return (
        <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Detail Polis {jenisCoas === "coas" ? "Coas" : "Non-Coas"}</h2>
            <p className="text-gray-600">
                Jika polis ini melibatkan co-insurance, silakan isi detailnya di bawah ini.
            </p>
            <TotalPremiDisplay />
            <div className="mt-4 space-y-4 rounded-lg border bg-gray-50/50 p-6">
                {showCoasFields ? (
                    <div className="space-y-4 animate-in fade-in-0">
                        <PremiInputBox />
                    </div>
                ) : (
                    <div>
                        <FormTextField<Polis> name='bisnis' label="Nomor Coas" />
                        <FormTextField<Polis> name='detail_bisnis' label="Total Coas" />
                    </div>
                )}
            </div>
        </section>
    );
}