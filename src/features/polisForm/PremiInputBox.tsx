import getPerusahaanList from "../polis/actions/get-perusahaan-list";
import { Path, useFormContext } from "react-hook-form";
import { Polis, PolisShare, PolisCoas } from "@/lib/polis/types";
import { useEffect, useState } from "react";
import { ListPerusahaanType } from "@/lib/polis/step3";
import SelectSearchField from "@/components/SelectSearchField";
import TextField from "@/components/TextField";
import { TrashIcon } from "@heroicons/react/24/solid";

type PremiInputBoxProps = {
    baseName: `shares` | `shares.${number}`;
    onRemove?: () => void;
};

export default function PremiInputBox({ baseName, onRemove }: PremiInputBoxProps) {
    const [perusahaanList, setPerusahaanList] = useState<ListPerusahaanType[]>([]);
    const [loading, setLoading] = useState(true);
    const isCoas = baseName.includes('.');


    useEffect(() => {
        const fetchPerusahaan = async () => {
            try {
                const result = await getPerusahaanList();
                if (!result.success) {
                    throw new Error(result.message || "Gagal mengambil daftar perusahaan.");
                }
                setPerusahaanList(result.data || []);
            } catch (error) {
                console.error("Error fetching perusahaan list:", error);
                if (error instanceof Error) {
                    alert(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPerusahaan();
    }, []);

    // Helper to prepend the name prefix
    const fieldName = (attribute: Path<PolisShare>) => (`${baseName}.${attribute}` as const);
    const currentIndex = Number(baseName.split('.')[1]);

    return (
        <div className="relative rounded-lg border border-gray-200 bg-white p-3 shadow-sm animate-in fade-in-0">
            {currentIndex === 0 ? 
            (<h2 className="mb-3 text-base font-semibold text-blue-500">Coas Leader</h2>) 
            : (<h2 className="mb-3 text-base font-semibold text-gray-900">Coas Member</h2>)}
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
            <div className="grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3">
                {loading && <p className="text-sm text-gray-500 md:col-span-2">Memuat data perusahaan...</p>}
                <SelectSearchField<Polis>
                    name={fieldName('id_perusahaan_asuransi')}
                    label={isCoas ? "Perusahaan Share" : "Perusahaan Asuransi"}
                    options={perusahaanList}
                    className="md:col-span-2"
                />
                {isCoas && (
                <TextField<Polis>
                    name={fieldName('persentase_share')}
                    label="Persentase Share (%)"
                />
                )}
                <TextField<Polis>
                    name={fieldName('detail_premi.discount')}
                    label="Discount"
                />
                <TextField<Polis>
                    name={fieldName('detail_premi.biaya_admin_materai')} 
                    label="Biaya Admin & Materai"
                />
                <TextField<Polis>
                    name={fieldName('detail_premi.premi_gross')}
                    label="Premi Gross"
                />
            </div>
        </div>
    );
}