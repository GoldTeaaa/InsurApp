import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Polis } from "@/lib/polis/types";
import TextField from "@/components/TextField";
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

    return ( // Wrapped in a div for better grouping and spacing
        <div className="space-y-4">
            <div>
                <label htmlFor={`${baseName}-discount-percentage`}>Discount (%)</label>
                <input
                    id={`${baseName}-discount-percentage`}
                    type="number"
                    value={percentage}
                    min="0"
                    max="100"
                    onChange={handlePercentageChange}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
            </div>
            <div>
                <TextField<Polis> name={amountFieldName} label="Discount (Amount)" type="number" />
                <p className="mt-1 text-xs text-gray-500">
                    {convertIDR(discountAmount)}
                </p>
            </div>
        </div>
    );
}