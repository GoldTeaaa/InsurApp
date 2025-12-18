import { Polis } from "@/lib/polis/create-types";
import { useFormContext, useWatch } from "react-hook-form";
import TotalPremiDisplay from "./TotalPremiDisplay";
import TotalSharePercentage from "./TotalSharePercentage";
import { useEffect, useState } from "react";
import getPerusahaanList from "../actions/getPerusahaanList";
import type { ListPerusahaanType } from "@/lib/polis/step3";
import CoasFields from "./CoasField";
import PremiKomisiBox from "./PremiKomisiBox";

export default function Step3() {
    const { control } = useFormContext<Polis>();

    const [perusahaanList, setPerusahaanList] = useState<ListPerusahaanType[]>([]);
    const [loading, setLoading] = useState(true);

    const jenisCoas = useWatch({
        control,
        name: "jenis_coas",
    });

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

    const showCoasFields = jenisCoas === "coas";

    return (
        <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
                Detail Premi & Share Polis{' '}
                <span className="font-bold text-sky-600">{showCoasFields ? "Coas" : "Non-Coas"}</span>
            </h2>
            <div className="space-y-4">
                <TotalPremiDisplay />
            </div>
            {loading && <p className="text-sm text-gray-500">Memuat data perusahaan...</p>}
            <div className="space-y-4">
                {showCoasFields ? (
                    <div>
                        <TotalSharePercentage
                            perusahaanList={perusahaanList}
                        />
                        <CoasFields perusahaanList={perusahaanList} />
                    </div>
                ) : (
                    <PremiKomisiBox 
                        baseName="shares" 
                        perusahaanList={perusahaanList} 
                    />
                )}
            </div>
        </section>
    );
}