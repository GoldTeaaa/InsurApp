import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Polis } from "@/features/polis/schema/create-types";
import TextField from "@/components/TextField";
import { SelectField } from "@/components/SelectField";
import { convertIDR } from "@/lib/utils/convertIDR";
import CalculatedTextField from "@/components/CalculatedTextField";

export default function PremiCalculationGroup() {
    const { control, setValue } = useFormContext<Polis>();

    const [totalSumInsured, nilaiRate, jenisRate, total_premi] = useWatch({
        control,
        name: ["total_sum_insured", "nilai_rate", "jenis_rate", "total_premi"],
    });

    useEffect(() => {
        const tsi = Number(totalSumInsured) || 0;
        const rate = Number(nilaiRate) || 0;

        let calculatedPremi = 0;
        if (jenisRate === 'mille') {
            calculatedPremi = tsi * (rate / 1000); // Per mil (‰)
        } else if (jenisRate === 'percent') {
            calculatedPremi = tsi * (rate / 100); // Percent (%)
        }

        setValue("total_premi", Number(calculatedPremi.toFixed(2)), { shouldValidate: true, shouldDirty: true });
    }, [totalSumInsured, nilaiRate, jenisRate, setValue]);

    return (
        <div className="space-y-4 rounded-md border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Perhitungan Premi</h3>
            <TextField<Polis>
                name='total_sum_insured'
                label="Total Sum Insured"
                // type="number"
            />  
            <p className="mt-1 text-xs text-gray-500 -translate-y-3">
                {convertIDR(totalSumInsured)}
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField<Polis>
                    name='nilai_rate'
                    label="Nilai Rate"
                    type="number"
                    step="any"
                />
                <SelectField<Polis>
                    name='jenis_rate'
                    label="Jenis Rate"
                    options={["mille", "percent"]}
                />
            </div>
            <CalculatedTextField<Polis>
                name="total_premi"
                label="Total Premi (Calculated)"
            />
            <p className="mt-1 text-xs text-gray-500 -translate-y-3">
                {convertIDR(total_premi)}
            </p>
        </div>
    );
}