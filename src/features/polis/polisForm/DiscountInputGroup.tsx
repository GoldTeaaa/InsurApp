import { useFormContext, useWatch } from "react-hook-form";
import { Polis } from "@/features/polis/schema/create-types";
import PercentageAmountGroup from "@/components/PercentageAmountGroup";

type Props = {
    baseName: `shares` | `shares.${number}`;
};

export default function DiscountInputGroup({ baseName }: Props) {
    const { control } = useFormContext<Polis>();

    const amountFieldName = `${baseName}.detail_premi.discount` as const;
    const grossFieldName = `${baseName}.detail_premi.premi_gross` as const;

    const [premiGross] = useWatch({
        control,
        name: [grossFieldName],
    });

    return (
        <PercentageAmountGroup
            baseValue={Number(premiGross) || 0}
            amountFieldName={amountFieldName}
            id={`${baseName}-discount-percentage`}
            percentageLabel="Discount (%)"
            amountLabel="Discount (Amount)"
            percentagePlaceholder="e.g., 10"
            minPercentage={0}
            maxPercentage={100}
            percentagePrecision={2}
        />
    );
}