import FormTextField from "@/components/TextField";
import { type Polis } from "@/lib/polis/types";
import DateField from "@/components/DateField";
import PremiCalculationGroup from "./PremiCalculationGroup";
import { RadioField } from "@/components/RadioField";

export default function Step2() {
    return (
        <section className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Detail Polis</h2>
            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
                    <FormTextField<Polis>
                        name='nomor_polis'
                        label="Nomor Polis"
                    />
                    <RadioField<Polis>
                        name='jenis_coas'
                        label="Jenis Polis"
                        options={["non-coas", "coas"]}
                    />
                </div>

                <PremiCalculationGroup />

                <div className="space-y-4 rounded-md border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-800">Periode Polis</h3>
                    <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
                        <DateField<Polis>
                            name='periode_mulai'
                            label="Tanggal Mulai"
                        />
                        <DateField<Polis>
                            name='periode_akhir'
                            label="Tanggal Akhir"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}