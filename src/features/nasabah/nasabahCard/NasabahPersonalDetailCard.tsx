"use client";
import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NasabahFormType,
  NasabahPerusahaanType,
  NasabahPribadiType
} from "@/lib/nasabah/type";
import { Separator } from "@/components/ui/separator";
import CopyableValue from "@/components/CopyableField";


type Props = {
  data: NasabahFormType;
};

export default function NasabahPersonalDetailCard({ data }: Props) {
  if (data.tipe === "pribadi") {
    return <NasabahPribadiCard data={data} />;
  }

  if (data.tipe === "perusahaan") {
    return <NasabahPerusahaanCard data={data} />;
  }

  return null;
}

const DetailItem = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | null;
  children?: ReactNode;
}) => (
  <div className="flex flex-col gap-1 text-sm sm:grid sm:grid-cols-[150px_1fr] sm:items-start sm:gap-2">
    <dt className="text-gray-500">{label}</dt>
    <dd className="font-bold">{children || value || "-"}</dd>
  </div>
);


function NasabahPribadiCard({ data }: { data: NasabahPribadiType }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Pribadi</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Identity & Personal */}
        <section>
          <h3 className="mb-3 text-sm font-bold text-muted-foreground">
            Identitas
          </h3>
          <Separator className="mb-4" />

          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailItem label="NIK">
              <CopyableValue value={data.nik} />
            </DetailItem>

            <DetailItem label="Jenis Kelamin" value={data.jenis_kelamin} />
            <DetailItem label="Tempat Lahir" value={data.tempat_lahir} />
            <DetailItem label="Tanggal Lahir" value={data.tanggal_lahir} />
            <DetailItem
              label="Status Perkawinan"
              value={data.status_perkawinan}
            />
            <DetailItem label="Kewarganegaraan" value={data.kewarganegaraan} />
          </dl>
        </section>

        {/* Address */}
        <section>
          <h3 className="mb-3 text-sm font-bold text-muted-foreground">
            Informasi KTP
          </h3>
          <Separator className="mb-4" />


          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailItem label="Alamat">
              <CopyableValue value={data.alamat_ktp} />
            </DetailItem>

            <DetailItem
              label="RT/RW"
              value={
                data.rt && data.rw ? `${data.rt}/${data.rw}` : null
              }
            />

            <DetailItem label="Kelurahan/Desa" value={data.kelurahan_desa} />
            <DetailItem label="Kecamatan" value={data.kecamatan} />
            <DetailItem label="Kota/Kabupaten" value={data.kota_kabupaten} />
            <DetailItem label="Provinsi" value={data.provinsi} />
            <DetailItem label="Kode Pos" value={data.kode_pos} />
          </dl>
        </section>

        {/* Social & Work */}
        <section>
          <h3 className="mb-3 text-sm font-bold text-muted-foreground">
            Informasi Lainnya
          </h3>
          <Separator className="mb-4" />

          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailItem label="Agama" value={data.agama} />
            <DetailItem label="Pekerjaan" value={data.pekerjaan} />
          </dl>
        </section>

      </CardContent>
    </Card>
  );
}


function NasabahPerusahaanCard({ data }: { data: NasabahPerusahaanType }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Perusahaan</CardTitle>
        {/* <CardDescription>Details for the company representative</CardDescription> */}
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DetailItem label="Alamat" value={data.alamat} />
          <DetailItem label="NPWP Perusahaan" value={data.npwp_perusahaan} />
          <DetailItem label="Nama PIC" value={data.nama_pic} />
          <DetailItem label="Jabatan PIC" value={data.jabatan_pic} />
          <DetailItem label="Email PIC" value={data.email_pic} />
        </dl>
      </CardContent>
    </Card>
  );
}
