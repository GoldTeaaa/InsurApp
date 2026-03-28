import { useFormContext, useWatch } from "react-hook-form";
import { Polis } from "@/features/polis/schema/create-types";
import { convertIDR } from "@/lib/utils/convertIDR";

export default function TotalPremiDisplay() {
    const { control } = useFormContext<Polis>();
    const totalPremi = useWatch({
        control,
        name: "total_premi",
    });

    return (
        <div className="flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <span className="text-lg font-medium text-gray-800">Total Premi</span>
            <span className="text-lg font-semibold text-blue-700">{convertIDR(totalPremi)}</span>
        </div>
    );
}