import FormTextField from "@/components/TextField";
import { NasabahForm } from "@/lib/nasabah/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormContext } from "react-hook-form";

export default function PerusahaanForm() {

    const { control } = useFormContext<NasabahForm>();

    return (
        <div>
            <FormTextField<NasabahForm>
                name='nama'
                label="Nama Asuransi"
            />
            <FormTextField<NasabahForm>
                name='contact_1'
                label="Kontak Utama"
            />
            <FormTextField<NasabahForm>
                name='contact_2'
                label="Kontak Kedua"
            />
            <FormTextField<NasabahForm>
                name='email'
                label="Email"
            />
            <FormTextField<NasabahForm>
                name='alamat'
                label="Alamat Perusahaan"
            />     
            <FormTextField<NasabahForm>
                name='npwp_perusahaan'
                label="NPWP Perusahaan"
            />
            <div> 
                <FormTextField<NasabahForm>
                    name='nama_pic'
                    label="Nama PIC"
                />
                <FormTextField<NasabahForm>
                    name='jabatan_pic'
                    label="Jabatan PIC"
                />
                <FormTextField<NasabahForm>
                    name='email_pic'
                    label="Email PIC"
                />
            </div>
        </div>
    )
}