import { useEffect, useState } from "react";
import { useFormContext, useWatch, Path } from "react-hook-form";
import { Polis } from "@/lib/polis/create-types";
import TextField from "@/components/TextField";
import UncontrolledTextField from "@/components/UncontrolledTextField";
import { convertIDR } from "@/lib/utils/convertIDR";

type Props = {
    /** The base value for percentage calculation (e.g., premi gross, komisi gross). */
    baseValue: number;
    /** The name/path for the amount field in the react-hook-form state. */
    amountFieldName: Path<Polis>;
    /** A unique identifier for the component, used for input IDs. */
    id: string;
    /** The label for the percentage input field. */
    percentageLabel: string;
    /** The label for the amount input field. */
    amountLabel: string;
    /** Placeholder text for the percentage input. */
    percentagePlaceholder?: string;
    /** Optional number of decimal places for displaying the percentage. */
    percentagePrecision?: number;
    /** Optional min value for percentage. */
    minPercentage?: number;
    /** Optional max value for percentage. */
    maxPercentage?: number;
};

export default function PercentageAmountGroup({
    baseValue,
    amountFieldName,
    id,
    percentageLabel,
    amountLabel,
    percentagePlaceholder,
    percentagePrecision,
    minPercentage,
    maxPercentage,
}: Props) {
    const { control, setValue } = useFormContext<Polis>();
    const [percentage, setPercentage] = useState<string | number>("");

    const [amountValue] = useWatch({
        control,
        name: [amountFieldName],
    });

    // EFFECT: When the amount or base value changes, update the percentage input.
    useEffect(() => {
        const gross = Number(baseValue) || 0;
        const amount = Number(amountValue) || 0;
        const newPercentage = gross > 0 ? (amount / gross) * 100 : 0;

        if (percentagePrecision !== undefined) {
            setPercentage(newPercentage > 0 ? newPercentage.toFixed(percentagePrecision) : "");
        } else {
            setPercentage(newPercentage);
        }
    }, [amountValue, baseValue, percentagePrecision]);

    // HANDLER: When the percentage input changes, update the amount in the form.
    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setPercentage(rawValue);

        if (rawValue === "" || isNaN(parseFloat(rawValue))) {
            setValue(amountFieldName, 0, { 
                shouldValidate: true, 
                shouldDirty: true }
            );
            return;
        }

        let newPercentage = parseFloat(rawValue);
        if (minPercentage !== undefined) newPercentage = Math.max(minPercentage, newPercentage);
        if (maxPercentage !== undefined) newPercentage = Math.min(maxPercentage, newPercentage);

        const gross = Number(baseValue) || 0;
        const newAmount = (gross * newPercentage) / 100;
        const value = newAmount.toFixed(percentagePrecision || 0);
        setValue(amountFieldName, value, { shouldValidate: true, shouldDirty: true });
    };

    return (
        <div className="grid grid-cols-5 items-start gap-x-4 rounded-md border border-gray-200 p-3">
            <div className="col-span-2">
                <UncontrolledTextField
                    id={id}
                    label={percentageLabel}
                    type="number"
                    value={percentage}
                    onChange={handlePercentageChange}
                    placeholder={percentagePlaceholder}
                    min={minPercentage}
                    max={maxPercentage}
                />
            </div>
            <div className="col-span-3">
                <TextField<Polis>
                    name={amountFieldName}
                    label={amountLabel}
                    type="number"
                />
                <p className="mt-1 text-xs text-gray-500">{convertIDR(amountValue || 0)}</p>
            </div>
        </div>
    );
}