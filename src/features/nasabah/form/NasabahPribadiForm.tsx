import FormCard from "@/components/FormCard";
import DateField from "@/components/DateField";
import { SelectField } from "@/components/SelectField";
import TextField from "@/components/TextField";
import { AGAMA, GENDER, NasabahForm, STATUS_PERKAWINAN } from "@/lib/nasabah/type";
import { KEWARGANEGARAAN } from "@/lib/nasabah/types";
import { Separator } from "@/components/ui/separator";

export default function PribadiForm() {

    return (
        <div className="space-y-6">
            {/* === Section: Identitas === */}
            <FormCard title="Identitas" description="Lengkapi data identitas nasabah pribadi.">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField<NasabahForm> name="nama" label="Nama Lengkap" />
                    <TextField<NasabahForm>
                        name="nik"
                        label="NIK"
                    />

                    <TextField<NasabahForm> name="tempat_lahir" label="Tempat Lahir" />
                    <DateField<NasabahForm> name="tanggal_lahir" label="Tanggal Lahir" />

                    <SelectField<NasabahForm> name="jenis_kelamin" label="Jenis Kelamin" options={GENDER} />
                    <TextField<NasabahForm> name="pekerjaan" label="Pekerjaan" />
                </div>
            </FormCard>

            <Separator />

            {/* === Section: Alamat Sesuai KTP === */}
            <FormCard title="Alamat Sesuai KTP" description="Gunakan alamat yang tercantum pada KTP.">
                <div className="grid grid-cols-1 gap-4">
                    <TextField<NasabahForm> name="alamat_ktp" label="Alamat KTP" />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField<NasabahForm> name="kelurahan_desa" label="Kelurahan/Desa" />
                    <TextField<NasabahForm> name="kecamatan" label="Kecamatan" />

                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField<NasabahForm> name="kota_kabupaten" label="Kota/Kabupaten" />
                    <TextField<NasabahForm> name="provinsi" label="Provinsi" />
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
                    <TextField<NasabahForm> name="rt" label="RT" />
                    <TextField<NasabahForm> name="rw" label="RW" />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SelectField<NasabahForm> name="agama" label="Agama" options={AGAMA} />
                    <SelectField<NasabahForm> name="status_perkawinan" label="Status Perkawinan" options={STATUS_PERKAWINAN} />
                    <SelectField<NasabahForm> name="kewarganegaraan" label="Kewarganegaraan" options={KEWARGANEGARAAN} />
                </div>
            </FormCard>

            <Separator />

            {/* === Section: Kontak & Alamat Tinggal === */}
            <FormCard title="Kontak & Alamat Tinggal" description="Informasi untuk keperluan komunikasi dan domisili saat ini.">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <TextField<NasabahForm>
                        name="contact_1"
                        label="Kontak Utama"
                    />
                    <TextField<NasabahForm>
                        name="contact_2"
                        label="Kontak Kedua"
                    />
                    <TextField<NasabahForm>
                        name="email"
                        label="Email"
                    />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4">
                    <TextField<NasabahForm> name="alamat" label="Alamat Tinggal" />
                </div>
            </FormCard>
        </div>
    );
}
