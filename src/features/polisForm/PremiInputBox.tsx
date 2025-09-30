import getPerusahaanList from "../polis/actions/get-perusahaan-list";
import { useFormContext, useWatch } from "react-hook-form";
import { DetailPremi, Polis, PolisShare } from "@/lib/polis/types";
import { useEffect, useState } from "react";
import { ListPerusahaanType } from "@/lib/polis/step3";
import SelectSearchField from "@/components/SelectSearchField";
import TextField from "@/components/TextField";

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
            <div>
                {loading && <p className="text-sm text-gray-500">Memuat data perusahaan...</p>}
                <SelectSearchField<PolisShare>
                    name='id_perusahaan_asuransi'
                    label="Perusahaan"
                    options={perusahaanList}
                />
            </div>
            <TextField<PolisShare> 
                name='persentase_share'
                label="Persentase Share"
            />
            <TextField<DetailPremi> 
                name='discount'
                label="Discount"
            />
            <TextField<DetailPremi> 
                name='premi_gross'
                label="Premi Gross"
            />
            <TextField<DetailPremi>
                name='biaya_admin_materai'
                label="Biaya Admin & Materai"
            />
        </div>
    );
}