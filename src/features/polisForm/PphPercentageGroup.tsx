import { useEffect, useState } from "react";
import { useFormContext, useWatch, FieldValue } from "react-hook-form";
import { Polis } from "@/lib/polis/types";
import TextField from "@/components/TextField";
import UncontrolledTextField from "@/components/UncontrolledTextField";
import { convertIDR } from "@/lib/utils/convertIDR";

type Props = {
    baseName: `shares` | `shares.${number}`;
    komisiGross: number;
};

export default function PphPercentageGroup({ baseName, komisiGross }: Props) {
    const { control, setValue } = useFormContext<Polis>();
    const [percentage, setPercentage] = useState<string | number>("");

    const amountFieldName = `${baseName}.detail_komisi.pph_komisi` as const;

    const [pphAmount] = useWatch({
        control,
        name: [amountFieldName],
    });

    // Effect 1: When the nominal PPH amount or komisi gross changes, update the percentage input
    useEffect(() => {
        const gross = Number(komisiGross) || 0;
        const amount = Number(pphAmount) || 0;
        const newPercentage = gross > 0 ? (amount / gross) * 100 : 0;
        setPercentage(newPercentage > 0 ? newPercentage.toFixed(2) : "");
    }, [pphAmount, komisiGross]);

    // Handler: When the percentage input changes, update the nominal PPH amount
    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setPercentage(rawValue);

        if (rawValue === '' || isNaN(parseFloat(rawValue))) {
            setValue(amountFieldName, 0, { shouldValidate: true, shouldDirty: true });
            return;
        }

        const newPercentage = parseFloat(rawValue);
        const gross = Number(komisiGross) || 0;
        const newAmount = (gross * newPercentage) / 100;
        setValue(amountFieldName, newAmount, { shouldValidate: true, shouldDirty: true });
    };

    return (
        <div className="grid grid-cols-5 items-start gap-x-4 rounded-md border border-gray-200 p-3">
            {/* Percentage Input */}
            <div className="col-span-2">
                <UncontrolledTextField
                    id={`${baseName}-pph-percentage`}
                    label="PPH Komisi (%)"
                    type="number"
                    value={percentage}
                    onChange={handlePercentageChange}
                    placeholder="e.g., 2"
                />
            </div>
            {/* Amount Input */}
            <div className="col-span-3">
                <TextField<Polis> name={amountFieldName} label="PPH Komisi (Amount)" type="number" />
                <p className="mt-1 text-xs text-gray-500">
                    {convertIDR(pphAmount || 0)}
                </p>
            </div>
        </div>
    );
}