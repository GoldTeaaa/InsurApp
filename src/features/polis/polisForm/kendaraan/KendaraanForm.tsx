import { SelectField } from "@/components/SelectField"
import FormTextField from "@/components/TextField"
import { Polis } from "@/lib/polis/create-types"
import { jenis_kendaraan } from "@/lib/types"

export default function KendaraanForm() {

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Detail Kendaraan</h3>
            <SelectField<Polis>
                name="kendaraan.jenis_kendaraan"
                label="Jenis Kendaraan"
                options={jenis_kendaraan}
            />
            <FormTextField<Polis>
                name="kendaraan.plat_nomor"
                label="Plat Nomor"
            />
        </div>
    )
}