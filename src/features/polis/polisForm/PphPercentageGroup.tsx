import PercentageAmountGroup from "@/components/PercentageAmountGroup";

type Props = {
    baseName: `shares` | `shares.${number}`;
    komisiGross: number;
};

export default function PphPercentageGroup({ baseName, komisiGross }: Props) {
    const amountFieldName = `${baseName}.detail_komisi.pph_komisi` as const;

    return (
        <PercentageAmountGroup
            baseValue={komisiGross}
            amountFieldName={amountFieldName}
            id={`${baseName}-pph-percentage`}
            percentageLabel="PPH Komisi (%)"
            amountLabel="PPH Komisi (Amount)"
            percentagePlaceholder="e.g., 2"
            // percentagePrecision={2}
        />
    );
}