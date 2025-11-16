import FormTextField from "@/components/TextField";
import { NasabahForm } from "@/lib/nasabah/type";

export default function PerusahaanForm() {

    return (
        <div className="space-y-6">
            {/* Identitas Perusahaan */}
            <fieldset className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
                <legend className="-ml-1 px-1 text-sm font-medium text-gray-800">Identitas Perusahaan</legend>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormTextField<NasabahForm> name="nama" label="Nama Asuransi" />
                    <FormTextField<NasabahForm> name="npwp_perusahaan" label="NPWP Perusahaan" />
                </div>
            </fieldset>

            {/* Kontak & Alamat */}
            <fieldset className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
                <legend className="-ml-1 px-1 text-sm font-medium text-gray-800">Kontak & Alamat</legend>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FormTextField<NasabahForm> name="contact_1" label="Kontak Utama" />
                    <FormTextField<NasabahForm> name="contact_2" label="Kontak Kedua" />
                    <FormTextField<NasabahForm> name="email" label="Email" />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4">
                    <FormTextField<NasabahForm> name="alamat" label="Alamat Perusahaan" />
                </div>
            </fieldset>

            {/* PIC Perusahaan */}
            <fieldset className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
                <legend className="-ml-1 px-1 text-sm font-medium text-gray-800">PIC Perusahaan</legend>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FormTextField<NasabahForm> name="nama_pic" label="Nama PIC" />
                    <FormTextField<NasabahForm> name="jabatan_pic" label="Jabatan PIC" />
                    <FormTextField<NasabahForm> name="email_pic" label="Email PIC" />
                </div>
            </fieldset>
        </div>
    );
}