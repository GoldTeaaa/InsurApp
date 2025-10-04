import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Polis } from "@/lib/polis/types";
import TextField from "@/components/TextField";
import UncontrolledTextField from "@/components/UncontrolledTextField";
import { convertIDR } from "@/lib/utils/convertIDR";
type Props = {
    baseName: `shares` | `shares.${number}`;
    premiGross: number;
};

export default function KomisiPercentageGroup({ baseName, premiGross }: Props) {
    const { control, setValue, getValues } = useFormContext<Polis>();
    const [percentage, setPercentage] = useState<string | number>("");

    const amountFieldName = `${baseName}.detail_komisi.komisi_gross` as const;

    const [komisiGrossAmount] = useWatch({
        control,
        name: [amountFieldName],
    });

    // Effect 1: When the gross komisi amount or premi gross changes, update the percentage input
    useEffect(() => {
        const grossPremi = Number(premiGross) || 0;
        const amount = Number(komisiGrossAmount) || 0;
        const newPercentage = grossPremi > 0 ? (amount / grossPremi) * 100 : 0;
        // Use a specific number of decimal places to avoid floating point noise
        setPercentage(newPercentage > 0 ? newPercentage.toFixed(2) : "");
    }, [komisiGrossAmount, premiGross]);

    // Handler: When the percentage input changes, update the gross komisi amount
    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setPercentage(rawValue); // Allow user to type freely

        if (rawValue === '' || isNaN(parseFloat(rawValue))) {
            setValue(amountFieldName, 0, { shouldValidate: true, shouldDirty: true });
            return;
        }

        const newPercentage = parseFloat(rawValue);
        const grossPremi = Number(premiGross) || 0;
        const newAmount = (grossPremi * newPercentage) / 100;
        setValue(amountFieldName, newAmount, { shouldValidate: true, shouldDirty: true });
    };

    return (
        <div className="grid grid-cols-5 items-start gap-x-4 rounded-md border border-gray-200 p-3">
            {/* Percentage Input */}
            <div className="col-span-2">
                <UncontrolledTextField
                    id={`${baseName}-komisi-percentage`}
                    label="Komisi (%)"
                    type="number"
                    value={percentage}
                    onChange={handlePercentageChange}
                    placeholder="e.g., 15"
                />
            </div>
            {/* Amount Input */}
            <div className="col-span-3">
                <TextField<Polis> name={amountFieldName} label="Komisi Gross (Amount)" type="number" />
                <p className="mt-1 text-xs text-gray-500">
                    {convertIDR(komisiGrossAmount || 0)}
                </p>
            </div>
        </div>
    );
}