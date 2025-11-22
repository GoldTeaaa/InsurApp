import DateField from "@/components/DateField";
import { SelectField } from "@/components/SelectField";
import FormTextField from "@/components/TextField";
import { type PembayaranKomisiInputForm } from "@/lib/pembayaran/pembayaran_komisi/types";
import { CARA_BAYAR } from "@/lib/types";

export default function BasePembayaranKomisiForm() {

    return (
        <div>
            <DateField<PembayaranKomisiInputForm>
                name="tanggal_bayar"
                label="Tanggal Bayar"
            />
            <FormTextField<PembayaranKomisiInputForm>
                name="no_kwitansi"
                label="Nomor Kwitansi"
            />
            <FormTextField<PembayaranKomisiInputForm>
                name="amount_paid"
                label="Jumlah Bayar"
                type="number"
            />
            <SelectField<PembayaranKomisiInputForm>
                name='cara_bayar'
                label="Cara Bayar"
                options={CARA_BAYAR}
            />
            <FormTextField<PembayaranKomisiInputForm>
                name='rekening_bank'
                label="Rekening Bank (Opsional)"
            />
        </div>
    )
}