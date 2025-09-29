import getPerusahaanList from "../polis/actions/get-perusahaan-list";
import { useFormContext, useWatch } from "react-hook-form";
import { Polis, PolisShare } from "@/lib/polis/types";
import { useEffect, useState } from "react";
import { ListPerusahaanType } from "@/lib/polis/step3";
import SelectSearchField from "@/components/SelectSearchField";

export default function PremiInputBox() {
    const [perusahaanList, setPerusahaanList] = useState<ListPerusahaanType[]>([]);
    const [loading, setLoading] = useState(true);

    
    const { control } = useFormContext<Polis>();

    useEffect(() => {
        // Define an async function and then call it immediately.
        const fetchPerusahaan = async () => {
            try {
                const result = await getPerusahaanList();
                if (!result.success) {
                    // Throw the error message from the result object.
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

    return (
        <div className="space-y-4 animate-in fade-in-0">
            {/* This is where you would add your form fields for "non-coas" */}
            <p className="text-sm text-gray-700">Premi Input Box Content</p>
            {loading && <p className="text-sm text-gray-500">Memuat data perusahaan...</p>}
            <SelectSearchField<PolisShare>
                name='id_perusahaan_asuransi'
                label="Perusahaan"
                options={perusahaanList}
            />
        </div>
    );
}