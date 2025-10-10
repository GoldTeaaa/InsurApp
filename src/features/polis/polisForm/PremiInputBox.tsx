import { Path, useFormContext, useWatch } from "react-hook-form";
import { Polis, PolisShare } from "@/lib/polis/types";
import { ListPerusahaanType } from "@/lib/polis/step3";
import TextField from "@/components/TextField";
import CalculatedTextField from "@/components/CalculatedTextField";
import DiscountInputGroup from "./DiscountInputGroup";
import { convertIDR } from "@/lib/utils/convertIDR";

type PremiInputBoxProps = {
    fieldName: (attribute: Path<PolisShare>) => `shares.${number}.${Path<PolisShare>}` | `shares.${Path<PolisShare>}`;
    isCoas: boolean;
    perusahaanList: ListPerusahaanType[];
    baseName: `shares` | `shares.${number}`;
};

export default function PremiInputBox({ fieldName, isCoas, baseName }: PremiInputBoxProps) {

    const { control } = useFormContext<Polis>();

    const [premiGross, premiNet, biayaAdminMaterai] = useWatch({
        control,
        name: [
            fieldName('detail_premi.premi_gross'),
            fieldName('detail_premi.premi_net'),
            fieldName('detail_premi.biaya_admin_materai')
        ]
    });

    return (
        <div className="space-y-4 rounded-md border border-gray-200 p-3">
            <h3 className="text-base font-semibold text-gray-700">Detail Premi</h3>
            <TextField<Polis>
                name={fieldName('detail_premi.premi_gross')}
                label="Premi Gross"
                type="number"
                readOnly={!isCoas}
            />
            <p className="mt-2 text-xs text-gray-500">Premi Gross: <span>{convertIDR(Number(premiGross))}</span></p>
            <DiscountInputGroup
                baseName={baseName}
            />
            <TextField<Polis>
                name={fieldName('detail_premi.biaya_admin_materai')}
                label="Biaya Admin & Materai"
                type="number"
            />
            <p className="mt-1 text-xs text-gray-500">Total Biaya: <span className="mt-1 text-xs text-gray-500">{convertIDR(Number(biayaAdminMaterai))}</span></p>
            <CalculatedTextField<Polis>
                name={fieldName('detail_premi.premi_net')}
                label="Premi Net (Calculated)"
            />
            <p>Total Premi: <span className="font-semibold">{convertIDR(Number(premiNet))}</span></p>
        </div>
    )
}