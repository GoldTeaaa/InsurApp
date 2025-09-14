import DateField from "@/components/DateField";
import { SelectField } from "@/components/SelectField";
import TextField from "@/components/TextField";
import { AGAMA, GENDER, NasabahForm, STATUS_PERKAWINAN } from "@/lib/nasabah/type";
import { KEWARGANEGARAAN } from "@/lib/nasabah/types";
import { useFormContext } from "react-hook-form";

export default function PribadiForm() {

    const {
        control
    } = useFormContext<NasabahForm>();

    return (
        <div className="space-y-6">
            {/* === Section: Identitas === */}
            <fieldset className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
                <legend className="-ml-1 px-1 text-sm font-medium text-gray-800">Identitas</legend>
                <p className="mt-1 text-xs text-gray-500">Lengkapi data identitas nasabah pribadi.</p>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            </fieldset>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* === Section: Alamat Sesuai KTP === */}
            <fieldset className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
                <legend className="-ml-1 px-1 text-sm font-medium text-gray-800">Alamat Sesuai KTP</legend>
                <p className="mt-1 text-xs text-gray-500">Gunakan alamat yang tercantum pada KTP.</p>

                <div className="mt-4 grid grid-cols-1 gap-4">
                    <TextField<NasabahForm> name="alamat_ktp" label="Alamat KTP" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:max-w-md">
                    <TextField<NasabahForm> name="rt" label="RT" />
                    <TextField<NasabahForm> name="rw" label="RW" />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <TextField<NasabahForm> name="kelurahan_desa" label="Kelurahan/Desa" />
                    <TextField<NasabahForm> name="kecamatan" label="Kecamatan" />
                    <TextField<NasabahForm> name="kota_kabupaten" label="Kota/Kabupaten" />
                    <TextField<NasabahForm> name="provinsi" label="Provinsi" />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SelectField<NasabahForm> name="agama" label="Agama" options={AGAMA} />
                    <SelectField<NasabahForm> name="status_perkawinan" label="Status Perkawinan" options={STATUS_PERKAWINAN} />
                    <SelectField<NasabahForm> name="kewarganegaraan" label="Kewarganegaraan" options={KEWARGANEGARAAN} />
                </div>
            </fieldset>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* === Section: Kontak & Alamat Tinggal === */}
            <fieldset className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
                <legend className="-ml-1 px-1 text-sm font-medium text-gray-800">Kontak & Alamat Tinggal</legend>
                <p className="mt-1 text-xs text-gray-500">Informasi untuk keperluan komunikasi dan domisili saat ini.</p>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                    <TextField<NasabahForm> name="alamat" label="Alamat Tinggal"/>
                </div>
            </fieldset>
        </div>
    );
}
