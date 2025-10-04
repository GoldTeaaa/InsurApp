import CalculatedTextField from "@/components/CalculatedTextField";
import { Polis, PolisShare } from "@/lib/polis/types";
import { Path, useFormContext, useWatch, FieldValue } from "react-hook-form";
import { useEffect } from "react";
import KomisiPercentageGroup from "./KomisiPercentageGroup";
import { convertIDR } from "@/lib/utils/convertIDR";
import PphPercentageGroup from "./PphPercentageGroup";

type KomisiInputBoxProps = {
    fieldName: (attribute: Path<PolisShare>) => `shares.${number}.${Path<PolisShare>}` | `shares.${Path<PolisShare>}`;
    premiGross: number;
    baseName: `shares` | `shares.${number}`
};

export default function KomisiInputBox({ fieldName, premiGross, baseName }: KomisiInputBoxProps) {
    const { control, setValue } = useFormContext<Polis>();

    const [komisiGross, pphKomisi, komisiNet] = useWatch({
        control,
        name: [
            fieldName('detail_komisi.komisi_gross'),
            fieldName('detail_komisi.pph_komisi'),
            fieldName('detail_komisi.komisi_net')
        ]
    });

    useEffect(() => {
        const gross = Number(komisiGross) || 0;
        const pph = Number(pphKomisi) || 0;
        const net = gross - pph;
        setValue(fieldName('detail_komisi.komisi_net'), net, { shouldValidate: true, shouldDirty: true });
    }, [komisiGross, pphKomisi, setValue, fieldName]);

    return (
        <div>
            <h3 className="text-base font-semibold text-gray-700">Komisi</h3>
            <KomisiPercentageGroup
                baseName={baseName}
                premiGross={premiGross}
            />
            <PphPercentageGroup
                baseName={baseName}
                komisiGross={Number(komisiGross) || 0}
            />
            <CalculatedTextField
                name={fieldName('detail_komisi.komisi_net')}
                label="Komisi Net"
            />
            <p className="mt-1 text-xs text-gray-500">
                {convertIDR(komisiNet as number)}
            </p>
        </div>
    );
}