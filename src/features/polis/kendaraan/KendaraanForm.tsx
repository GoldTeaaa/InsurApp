import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { SelectField } from "@/components/SelectField"
import FormTextField from "@/components/TextField"
import { Polis } from "@/lib/polis/create-types"
import { jenis_kendaraan } from "@/lib/types"
import { formatPlatNomor } from "@/lib/utils/formatPlatNomor"

export default function KendaraanForm() {
    const { setValue } = useFormContext<Polis>()

    useEffect(() => {
        setValue("bisnis_details.bisnis", "kendaraan")
    }, [setValue])

    const [plat_nomor] = useWatch({
        name: ["bisnis_details.plat_nomor"],
    })

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Detail Kendaraan</h3>
            <SelectField<Polis>
                name="bisnis_details.jenis_kendaraan"
                label="Jenis Kendaraan"
                options={jenis_kendaraan}
                must={true}
            />
            <FormTextField<Polis>
                name="bisnis_details.plat_nomor"
                label="Plat Nomor"
                must={true}
            />
            <p className="text-sm text-gray-500 mt-1">Plat Nomor: {formatPlatNomor(plat_nomor)}</p>
        </div>
    )
}