import { useFormContext, useWatch } from "react-hook-form";
import { Polis } from "@/lib/polis/types";

function formatCurrency(value: number | string | undefined | null) {
    const num = Number(value || 0);
    if (isNaN(num)) {
        return "Rp 0";
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
}

export default function TotalPremiDisplay() {
    const { control } = useFormContext<Polis>();
    const totalPremi = useWatch({
        control,
        name: "total_premi",
    });

    return (
        <div className="flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-base font-medium text-gray-800">Total Premi</span>
            <span className="text-lg font-semibold text-blue-700">{formatCurrency(totalPremi)}</span>
        </div>
    );
}