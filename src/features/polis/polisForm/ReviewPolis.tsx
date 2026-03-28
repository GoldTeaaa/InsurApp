import getNasabahCardDetails from "@/features/polis/actions/getNasabahForPolisCard";
import getPerusahaanList from "@/features/polis/actions/getPerusahaanList";
import { ListPerusahaanType } from "@/features/polis/schema/step3";
import { NasabahDetailsType } from "@/features/polis/schema/step1";
import { Polis } from "@/features/polis/schema/create-types";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { convertIDR } from "@/lib/utils/convertIDR";
import { form } from "framer-motion/client";

/**
 * A helper component to render a key-value pair in a consistent style.
 */
function ReviewField({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center">
            <dt className="w-full sm:w-1/3 font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 w-full sm:w-2/3 text-gray-900 sm:mt-0 font-semibold">{value || '-'}</dd>
        </div>
    );
}

export default function ReviewPolis() {
    const { control } = useFormContext<Polis>();
    const formData = useWatch({ control });
    // const id_nasabah = useWatch({ control, name: 'id_nasabah' });

    const [nasabahDetails, setNasabahDetails] = useState<NasabahDetailsType | null>(null);
    const [perusahaanList, setPerusahaanList] = useState<ListPerusahaanType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                console.log("formData: ", formData);
                const [nasabahResult, perusahaanResult] = await Promise.all([
                    getNasabahCardDetails(formData.id_nasabah || ""),
                    getPerusahaanList()
                ]);

                if (nasabahResult.success) {
                    console.log("nasabahResult.data: ", nasabahResult.data);
                    setNasabahDetails(nasabahResult.data ?? null);
                }

                if (perusahaanResult.success) {
                    console.log("perusahaanResult.data: ", perusahaanResult.data);
                    setPerusahaanList(perusahaanResult.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch review details", error);
            } finally {
                setLoading(false);
            }
        }

        if (formData.id_nasabah) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [formData.id_nasabah]);

    // Default shares is an array, but if it's a single share, wrap it in an array
    const shares = Array.isArray(formData.shares) ? formData.shares : [formData.shares];

    if (loading) {
        return (
            <section className="space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">Review Polis</h2>
                <p>Loading review...</p>
            </section>
        );
    }

    return (
        <section className="space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Review Polis</h2>
                <p className="mt-1 text-sm text-gray-500">Please review all the information below before submitting.</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-800">Data Nasabah</h3>
                <dl className="mt-4 space-y-4">
                    <ReviewField label="Nama Nasabah" value={nasabahDetails?.nama} />
                    <ReviewField label="Tipe Nasabah" value={nasabahDetails?.tipe} />
                    <ReviewField label="Alamat" value={nasabahDetails?.alamat} />
                    <ReviewField label="Kontak" value={nasabahDetails?.contact_1} />
                    <ReviewField label="Jenis Bisnis" value={formData.bisnis} />
                </dl>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-800">Detail Polis</h3>
                <dl className="mt-4 space-y-4">
                    <ReviewField label="Nomor Polis" value={formData.nomor_polis} />
                    <ReviewField label="Jenis Polis" value={formData.jenis_coas} />
                    <ReviewField label="Periode Mulai" value={formData.periode_mulai ? new Date(formData.periode_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'} />
                    <ReviewField label="Periode Akhir" value={formData.periode_akhir ? new Date(formData.periode_akhir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'} />
                    <ReviewField label="Total Sum Insured" value={convertIDR(formData.total_sum_insured)} />
                    <ReviewField label="Rate" value={`${formData.nilai_rate} ${formData.jenis_rate === 'mille' ? '‰' : '%'}`} />
                    <ReviewField label="Total Premi" value={convertIDR(formData.total_premi)} />
                </dl>
            </div>

            {shares.map((share, index) => (
                <div key={index} className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-800">
                        {formData.jenis_coas === 'coas' ? `Detail Share ${index + 1}` : 'Detail Premi & Komisi'}
                    </h3>
                    <dl className="mt-4 space-y-4">
                        <ReviewField label="Asuransi Penanggung" value={perusahaanList.find(p => p.id === share?.id_perusahaan_asuransi)?.value} />
                        {formData.jenis_coas === 'coas' && <ReviewField label="Persentase Share" value={`${share?.persentase_share}%`} />}
                        <ReviewField label="Premi Gross" value={convertIDR(share?.detail_premi?.premi_gross)} />
                        <ReviewField label="Discount" value={convertIDR(share?.detail_premi?.discount)} />
                        <ReviewField label="Biaya Admin & Materai" value={convertIDR(share?.detail_premi?.biaya_admin_materai)} />
                        <ReviewField label="Premi Net" value={convertIDR(share?.detail_premi?.premi_net)} />
                        <div className="py-2">
                            <div className="border-t border-gray-200"></div>
                        </div>
                        <ReviewField label="Komisi Gross" value={convertIDR(share?.detail_komisi?.komisi_gross)} />
                        <ReviewField label="PPH Komisi" value={convertIDR(share?.detail_komisi?.pph_komisi)} />
                        <ReviewField label="Komisi Net" value={convertIDR(share?.detail_komisi?.komisi_net)} />
                    </dl>
                </div>
            ))}
        </section>
    );
}