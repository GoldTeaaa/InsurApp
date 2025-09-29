import FormTextField from "@/components/TextField";
import { type Polis } from "@/lib/polis/types";
import DateField from "@/components/DateField";
import { SelectField } from "@/components/SelectField";

export default function Step2() {
    return (
        <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Detail Polis</h2>
            <div className="space-y-4">
                <FormTextField<Polis>
                    name='nomor_polis'
                    label="Nomor Polis"
                />
                <FormTextField<Polis>
                    name='total_premi'
                    label="Total Premi"
                />
                <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
                    <DateField<Polis>
                        name='periode_mulai'
                        label="Periode Mulai"
                    />
                    <span className="hidden text-center text-gray-500 md:block md:pb-2">-</span>
                    <DateField<Polis>
                        name='periode_akhir'
                        label="Periode Akhir"
                    />
                </div>
                <SelectField<Polis>
                    name='jenis_coas'
                    label="Jenis Coas"
                    options={["coas", "non-coas"]}
                />
            </div>
        </section>
    );
}