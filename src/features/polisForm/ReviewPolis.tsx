import { Polis } from "@/lib/polis/types";
import { useFormContext, useWatch } from "react-hook-form";

/**
 * A helper component to render a key-value pair in a consistent style.
 */
function ReviewField({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center">
            <dt className="w-full sm:w-1/3 font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 w-full sm:w-2/3 text-gray-900 sm:mt-0">{value || '-'}</dd>
        </div>
    );
}

export default function ReviewPolis() {
    const { control } = useFormContext<Polis>();

    const formData = useWatch({ control });

    // Default shares is an array, but if it's a single share, wrap it in an array
    const shares = Array.isArray(formData.shares) ? formData.shares : [formData.shares];

    return (
        <section className="space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Review Polis</h2>
            <dl className="space-y-4">
                <ReviewField label="Nomor Polis" value={formData.nomor_polis} />
                <ReviewField label="Jenis Bisnis" value={formData.bisnis} />
                <ReviewField label="Jenis Polis" value={formData.jenis_coas} />
                <ReviewField label="Periode Mulai" value={formData.periode_mulai ? new Date(formData.periode_mulai).toLocaleDateString() : '-'} />
                <ReviewField label="Periode Akhir" value={formData.periode_akhir ? new Date(formData.periode_akhir).toLocaleDateString() : '-'} />
                <ReviewField label="Total Premi" value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(formData.total_premi ? formData.total_premi : 0)} />
            </dl>

            {shares.map((share, index) => (
                <div key={index} className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-800">
                        {formData.jenis_coas === 'coas' ? `Share ${index + 1}` : 'Detail Premi'}
                    </h3>
                    <dl className="mt-4 space-y-4">
                        {formData.jenis_coas === 'coas' && <ReviewField label="Persentase Share" value={`${share?.persentase_share}%`} />}
                        <ReviewField
                            label="Premi Gross"
                            value={
                                new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(share?.detail_premi?.premi_gross ?? 0)
                            }
                        />
                        <ReviewField
                            label="Discount"
                            value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(share?.detail_premi?.discount ?? 0)}
                        />
                        <ReviewField
                            label="Premi Net"
                            value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(share?.detail_premi?.premi_net ?? 0)}
                        />
                    </dl>
                </div>
            ))}
        </section>
    );
}