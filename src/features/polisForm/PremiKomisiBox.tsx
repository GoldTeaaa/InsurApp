import { Path, useFormContext, useWatch } from "react-hook-form";
import { Polis, PolisShare } from "@/lib/polis/types";
import { useCallback, useEffect, useState } from "react";
import { ListPerusahaanType } from "@/lib/polis/step3";
import { TrashIcon } from "@heroicons/react/24/solid";
import PremiInputBox from "./PremiInputBox";
import KomisiInputBox from "./KomisiInputBox";
import SelectSearchField from "@/components/SelectSearchField";
import TextField from "@/components/TextField";

type PremiInputBoxProps = {
    baseName: `shares` | `shares.${number}`;
    onRemove?: () => void;
    perusahaanList: ListPerusahaanType[];
};

export default function PremiKomisiBox({ baseName, onRemove, perusahaanList }: PremiInputBoxProps) {
    const [_premiNetExceeded, setPremiNetExceeded] = useState(false);
    const { control, setValue } = useFormContext<Polis>();
    const isCoas = baseName.includes('.');

    // Helper to prepend the name prefix
    const fieldName = useCallback(
        (attribute: Path<PolisShare>) => (
            `${baseName}.${attribute}` as `shares.${number}.${Path<PolisShare>}` | `shares.${Path<PolisShare>}`
        ),
        [baseName]
    );

    const currentIndex = Number(baseName.split('.')[1]);

    const [totalPremi, persentaseShare, premiGross, discount, biayaAdmin] = useWatch({
        control,
        name: [
            'total_premi',
            fieldName('persentase_share'),
            fieldName('detail_premi.premi_gross'),
            fieldName('detail_premi.discount'),
            fieldName('detail_premi.biaya_admin_materai'),
        ]
    });

    useEffect(() => {
        const gross = Number(premiGross) || 0;
        const admin = Number(biayaAdmin) || 0;
        const discountAmount = Number(discount) || 0;

        const net = gross - discountAmount - admin;
        if (net > totalPremi) {
            setPremiNetExceeded(true);
            setValue(fieldName('detail_premi.premi_net'), "Premi exceeded", { shouldValidate: true });
        } else {
            setValue(fieldName('detail_premi.premi_net'), net, { shouldValidate: true, shouldDirty: true });
        }
    }, [premiGross, discount, biayaAdmin, setValue, fieldName]);

    useEffect(() => {
        const total = Number(totalPremi) || 0;
        const persentase = Number(persentaseShare) || 0;

        const gross = total * (persentase / 100);
        setValue(fieldName('detail_premi.premi_gross'), gross, { shouldValidate: true, shouldDirty: true });
    }, [totalPremi, persentaseShare, setValue, fieldName]);

    return (
        <div className="relative rounded-lg border border-gray-200 bg-white p-3 shadow-sm animate-in fade-in-0">
            {
                isCoas ? (
                    currentIndex === 0 ? (<h2 className="mb-3 text-base font-semibold text-blue-600">Coas Leader</h2>)
                        : (<h2 className="mb-3 text-base font-semibold text-gray-900">Coas Member {currentIndex}</h2>)
                ) : (
                    <h2 className="mb-3 text-base font-semibold text-gray-900">Input Detail Premi</h2>
                )
            }
            {onRemove && currentIndex > 1 && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-500 transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="Remove Share"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            )}
            <SelectSearchField<Polis>
                name={fieldName('id_perusahaan_asuransi')}
                label={isCoas ? "Perusahaan Share" : "Perusahaan Asuransi"}
                options={perusahaanList}
            />
            {isCoas && (
                <TextField<Polis>
                    name={fieldName('persentase_share')}
                    label="Persentase Share (%)"
                    type="number"
                />
            )}
            <div className="space-y-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Left Block: Premi Details */}
                <div className="space-y-4">
                    <PremiInputBox
                        fieldName={fieldName}
                        isCoas={isCoas}
                        perusahaanList={perusahaanList}
                        baseName={baseName}
                    />
                </div>
                {/* Right Block: Komisi Details (Placeholder) */}
                <div className="space-y-4">
                    <KomisiInputBox
                        fieldName={fieldName}
                        premiGross={Number(premiGross) || 0}
                        baseName={baseName}
                    />
                </div>
            </div>
        </div>
    );
}