'use client';

import { Button } from "@/components/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import { GetPolisSchema } from "@/lib/polis/get-types";
// import { getDefaultValues, PolisShare } from "@/lib/polis/create-types";
import { useEffect, useState } from "react";
import PremiKomisiBox from "../../polisForm/PremiKomisiBox";
import getPerusahaanList from "../../actions/getPerusahaanList";
import { ListPerusahaanType } from "@/lib/polis/step3";
import TotalSharePercentage from "../../polisForm/TotalSharePercentage";
// import { PlusIcon } from "lucide-react";

export default function DetailSharePolis() {
    const { control } = useFormContext<GetPolisSchema>();
    const [loading, setLoading] = useState(true);
    const [perusahaanList, setPerusahaanList] = useState<ListPerusahaanType[]>([]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "shares",
    });

    useEffect(() => {
        setLoading(true);
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

    // const handleAddShare = () => {
    //     const newShare = getDefaultValues("non-coas").shares;
    //     append({ ...newShare, persentase_share: 0 });
    // };

    // const jenisCoas = useWatch({ control, name: 'jenis_coas' });
    // const canAddMoreShares = jenisCoas === 'coas' || fields.length === 0;

    return (
        <div /**className="space-y-6 rounded-lg border border-gray-200 p-6"*/>
            <div>
                {fields.length > 1 && (
                    <div>
                        <TotalSharePercentage
                            perusahaanList={perusahaanList}
                        />
                    </div>
                )}
            </div>
            {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <PremiKomisiBox
                        key={field.id}
                        baseName={`shares.${index}`}
                        perusahaanList={perusahaanList}
                        editMode={true}
                    />
                </div>
            ))}
            {/* Future work may add dynamic update that can add new shares in update action */}
            {/* {canAddMoreShares && (
                <button
                type="button"
                onClick={handleAddShare}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-all hover:border-sky-500 hover:bg-sky-50 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
                <PlusIcon className="h-5 w-5" />
                Tambah Share
            </button>
            )} */}
        </div>
    );
}