import DateField from "@/components/DateField";
import { SelectField } from "@/components/SelectField";
import FormTextField from "@/components/TextField";
import { type PembayaranKomisiForm } from "@/lib/pembayaran/pembayaran_komisi/types";
import { cara_bayar } from "@/lib/pembayaran/pembayaran_premi/types";
import { useFormContext } from "react-hook-form"

export default function BasePembayaranKomisiForm() {

    const method = useFormContext();

    return (
        <div>
            <DateField<PembayaranKomisiForm>
                name="tanggal_bayar"
                label="Tanggal Bayar"
            />
            <FormTextField<PembayaranKomisiForm>
                name="no_kwitansi"
                label="Nomor Kwitansi"
            />
            <FormTextField<PembayaranKomisiForm>
                name="amount_paid"
                label="Jumlah Bayar"
                type="number"
            />
            <SelectField<PembayaranKomisiForm>
                name='cara_bayar'
                label="Cara Bayar"
                options={cara_bayar}
            />
            <FormTextField<PembayaranKomisiForm>
                name='rekening_bank'
                label="Rekening Bank (Opsional)"
            />
        </div>
    )
}