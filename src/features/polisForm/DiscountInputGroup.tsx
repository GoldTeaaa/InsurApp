import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Polis } from "@/lib/polis/types";
import TextField from "@/components/TextField";
import UncontrolledTextField from "@/components/UncontrolledTextField";
import { convertIDR } from "@/lib/utils/convertIDR";

type Props = {
    baseName: `shares` | `shares.${number}`;
};

export default function DiscountInputGroup({ baseName }: Props) {
    const { control, setValue, getValues } = useFormContext<Polis>();
    const [percentage, setPercentage] = useState<string | number>("");

    const amountFieldName = `${baseName}.detail_premi.discount` as const;
    const grossFieldName = `${baseName}.detail_premi.premi_gross` as const;

    const [discountAmount, premiGross] = useWatch({
        control,
        name: [amountFieldName, grossFieldName],
    });

    // EFFECT 1: When amount or gross changes, update the percentage input
    useEffect(() => {
        const gross = Number(premiGross) || 0;
        const amount = Number(discountAmount) || 0;
        const newPercentage = gross > 0 ? (amount / gross) * 100 : 0;
        setPercentage(newPercentage.toFixed(2));
    }, [discountAmount, premiGross]);

    // HANDLER: When percentage input changes, update the amount in the form
    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;

        // Allow empty string for clearing the input
        if (rawValue === '') {
            setPercentage('');
            setValue(amountFieldName, 0, { shouldValidate: true, shouldDirty: true });
            return;
        }

        const gross = Number(getValues(grossFieldName)) || 0;
        const newPercentage = Math.max(0, Math.min(100, Number(rawValue) || 0));

        setPercentage(newPercentage);

        if (gross > 0) {
            const newAmount = (gross * newPercentage) / 100;
            setValue(amountFieldName, newAmount, { shouldValidate: true, shouldDirty: true });
        }
    };

    return (
        <div className="grid grid-cols-5 items-start gap-x-4 rounded-md border border-gray-200 p-3">
            {/* Percentage Input */}
            <div className="col-span-2">
                <UncontrolledTextField
                    id={`${baseName}-discount-percentage`}
                    label="Discount (%)"
                    type="number"
                    value={percentage}
                    onChange={handlePercentageChange}
                    placeholder="e.g., 10"
                    min="0"
                    max="100"
                />
            </div>
            {/* Amount Input */}
            <div className="col-span-3">
                <TextField<Polis> name={amountFieldName} label="Discount (Amount)" type="number" />
                <p className="mt-1 text-s text-gray-500">
                    {convertIDR(discountAmount || 0)}
                </p>
            </div>

        </div>
    );
}