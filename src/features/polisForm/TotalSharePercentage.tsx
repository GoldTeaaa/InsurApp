import { ListPerusahaanType } from "@/lib/polis/step3";
import { Polis } from "@/lib/polis/types";
import { useEffect } from "react";
import { useFormContext, useWatch, useFormState } from "react-hook-form";

export default function TotalSharePercentage({ perusahaanList }: { perusahaanList: ListPerusahaanType[] }) {
    const {
        control,
        formState: { errors },
        setValue
    } = useFormContext<Polis>();

    const shares = useWatch({
        control,
        name: 'shares',
    });

    // Calculate total directly. It's cheap and avoids state-in-render issues.
    const totalPercentage = Array.isArray(shares)
        ? shares.reduce((sum, share) => sum + (Number(share.persentase_share) || 0), 0)
        : 0;

    useEffect(() => {
        // Side effects like setValue belong in useEffect.
        // This runs after render, when `shares` changes.
        if (!Array.isArray(shares) || shares.length === 0) {
            setValue('total_premi', 0);
        }
    }, [shares, setValue]);

    const isError = totalPercentage !== 100;
    const errorMessage = errors.shares?.message || (errors.shares)?.root?.message;

    return (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold">Total Share</h3>
            <p className={`text-2xl font-bold ${isError ? 'text-red-600' : 'text-green-600'}`}>
                {totalPercentage.toFixed(2)} %
            </p>
            {Array.isArray(shares) && shares.length > 0 && ( // Only show if there are shares
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {shares.map((share, index) => {
                        const perusahaan = perusahaanList.find(searchId => searchId.id === share.id_perusahaan_asuransi);
                        const isSelected = !!perusahaan;
                        const displayName = isSelected ? perusahaan.value : "Perusahaan belum dipilih";
                        return (
                            <p key={index}>
                                <span className={isSelected ? 'font-medium text-blue-600' : 'text-red-500'}>{displayName}</span>: {share.persentase_share || 0}%
                            </p>
                        );
                    })}
                    
                </div>
            )}
            {isError && errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
        </div>
    );
}