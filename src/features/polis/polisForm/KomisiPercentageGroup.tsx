import PercentageAmountGroup from "@/components/PercentageAmountGroup";

type Props = {
    baseName: `shares` | `shares.${number}`;
    premiGross: number;
};

export default function KomisiPercentageGroup({ baseName, premiGross }: Props) {
    const amountFieldName = `${baseName}.detail_komisi.komisi_gross` as const;

    return (
        <PercentageAmountGroup
            baseValue={premiGross}
            amountFieldName={amountFieldName}
            id={`${baseName}-komisi-percentage`}
            percentageLabel="Komisi (%)"
            amountLabel="Komisi Gross (Amount)"
            percentagePlaceholder="e.g., 15"
            // percentagePrecision={2}
        />
    );
}