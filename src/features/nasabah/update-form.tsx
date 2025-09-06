'use client';

import { useActionState, useMemo } from 'react';
import { updateNasabahV1, updateNasabahV2, type State } from '@/features/nasabah/actions';
import { tipeSchema, type NasabahFormUIData, type NasabahFormServerData } from '@/lib/nasabah/types';
import Link from 'next/link';

function FieldError({ name, state }: { name: string; state: State }) {
  const errs = state.errors?.[name];
  if (!errs) return null;
  return (
    <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
      {errs.map((e) => (
        <p key={e} className="mt-1 text-sm text-red-500">{e}</p>
      ))}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-blue-600 focus:ring-blue-600"
    />
  );
}
function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-blue-600 focus:ring-blue-600"
    />
  );
}
function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className="mb-1 block text-sm font-medium text-gray-700" />;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6 mb-6">
      <h3 className="mb-3 text-sm font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  );
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
    />
  );
}

// map null/undefined => '' to satisfy input defaultValue typing
const sv = (v: string | null | undefined) => v ?? '';

type updateNasabahValue = NasabahFormServerData & { updated_at?: string | null };

export default function EditNasabahForm({
  id,
  defaultValues
}: {
  id: string;
  defaultValues: updateNasabahValue;
}) {
  const initialState: State = { message: null, errors: {} };

  const updateWithId = useMemo(() => updateNasabahV2.bind(null, id), [id]);
  const [state, formAction, isPending] = useActionState(updateWithId, initialState);

  const formKey = useMemo(
    () => `${id}|${defaultValues.updated_at ?? ''}`,
    [id, defaultValues.updated_at]
  );

  // IMMUTABLE TIPE (no local state, no onChange)
  const tipe = defaultValues.tipe;

  return (
    <form key={formKey} action={formAction} className="max-w-3xl">
      {/* optimistic concurrency */}
      {defaultValues.updated_at ? (
        <input type="hidden" name="updated_at" value={sv(defaultValues.updated_at)} />
      ) : null}

      {/* submit the immutable tipe via hidden input to satisfy server parsing */}
      <input type="hidden" name="tipe" value={tipe} />

      <Section title="Data Utama">
        <div className="mb-4">
          <Label htmlFor="tipe">Tipe Nasabah</Label>
          {/* Readonly visible field so user sees the tipe but cannot change it */}
          <TextInput
            id="tipe"
            value={tipe}
            readOnly
            aria-readonly="true"
            aria-describedby="tipe-help"
          />
          <p id="tipe-help" className="mt-1 text-xs text-gray-500">
            Tipe nasabah bersifat permanen dan tidak dapat diubah.
          </p>
          <FieldError name="tipe" state={state} />
        </div>

        <div className="mb-4">
          <Label htmlFor="nama">Nama</Label>
          <TextInput id="nama" name="nama" defaultValue={
            tipe === 'pribadi' ?
              sv(defaultValues.pribadi?.nama_tertanggung) :
              sv(defaultValues.perusahaan?.nama_perusahaan)
          } />
          <FieldError name="nama" state={state} />
        </div>

        <div className="mb-4">
          <Label htmlFor="contact_1">Kontak 1</Label>
          <TextInput id="contact_1" name="contact_1" defaultValue={sv(defaultValues.contact_1)} aria-describedby="contact_1-error" />
          <FieldError name="contact_1" state={state} />
        </div>

        <div className="mb-4">
          <Label htmlFor="contact_2">Kontak 2</Label>
          <TextInput id="contact_2" name="contact_2" defaultValue={sv(defaultValues.contact_2)} aria-describedby="contact_2-error" />
          <FieldError name="contact_2" state={state} />
        </div>

        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <TextInput id="email" name="email" type="email" defaultValue={sv(defaultValues.email)} aria-describedby="email-error" />
          <FieldError name="email" state={state} />
        </div>

        <div className="mb-0">
          <Label htmlFor="alamat">Alamat</Label>
          <TextInput id="alamat" name="alamat" defaultValue={sv(defaultValues.alamat)} aria-describedby="alamat-error" />
          <FieldError name="alamat" state={state} />
        </div>
      </Section>

      {tipe === 'pribadi' && (
        <Section title="Data Pribadi">
          <div className="mb-4">
            <Label htmlFor="pribadi.nik">NIK</Label>
            <TextInput id="pribadi.nik" name="pribadi.nik" defaultValue={sv(defaultValues.pribadi?.nik)} aria-describedby="pribadi.nik-error" />
            <FieldError name="pribadi.nik" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.nama_tertanggung">Nama Tertanggung</Label>
            <TextInput id="pribadi.nama_tertanggung" name="pribadi.nama_tertanggung" defaultValue={sv(defaultValues.pribadi?.nama_tertanggung)} aria-describedby="pribadi.nama_tertanggung-error" />
            <FieldError name="pribadi.nama_tertanggung" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.tempat_lahir">Tempat Lahir</Label>
            <TextInput id="pribadi.tempat_lahir" name="pribadi.tempat_lahir" defaultValue={sv(defaultValues.pribadi?.tempat_lahir)} aria-describedby="pribadi.tempat_lahir-error" />
            <FieldError name="pribadi.tempat_lahir" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.tanggal_lahir">Tanggal Lahir</Label>
            <TextInput id="pribadi.tanggal_lahir" name="pribadi.tanggal_lahir" type="date" defaultValue={sv(defaultValues.pribadi?.tanggal_lahir)} aria-describedby="pribadi.tanggal_lahir-error" />
            <FieldError name="pribadi.tanggal_lahir" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.jenis_kelamin">Jenis Kelamin</Label>
            <SelectInput id="pribadi.jenis_kelamin" name="pribadi.jenis_kelamin" defaultValue={sv(defaultValues.pribadi?.jenis_kelamin)}>
              <option value="">-</option>
              <option value="L">L</option>
              <option value="P">P</option>
            </SelectInput>
            <FieldError name="pribadi.jenis_kelamin" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.alamat_ktp">Alamat KTP</Label>
            <TextInput id="pribadi.alamat_ktp" name="pribadi.alamat_ktp" defaultValue={sv(defaultValues.pribadi?.alamat_ktp)} />
            <FieldError name="pribadi.alamat_ktp" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.rt">RT</Label>
            <TextInput id="pribadi.rt" name="pribadi.rt" defaultValue={sv(defaultValues.pribadi?.rt)} />
            <FieldError name="pribadi.rt" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.rw">RW</Label>
            <TextInput id="pribadi.rw" name="pribadi.rw" defaultValue={sv(defaultValues.pribadi?.rw)} />
            <FieldError name="pribadi.rw" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.kelurahan_desa">Kelurahan/Desa</Label>
            <TextInput id="pribadi.kelurahan_desa" name="pribadi.kelurahan_desa" defaultValue={sv(defaultValues.pribadi?.kelurahan_desa)} />
            <FieldError name="pribadi.kelurahan_desa" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.kecamatan">Kecamatan</Label>
            <TextInput id="pribadi.kecamatan" name="pribadi.kecamatan" defaultValue={sv(defaultValues.pribadi?.kecamatan)} />
            <FieldError name="pribadi.kecamatan" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.kota_kabupaten">Kota/Kabupaten</Label>
            <TextInput id="pribadi.kota_kabupaten" name="pribadi.kota_kabupaten" defaultValue={sv(defaultValues.pribadi?.kota_kabupaten)} />
            <FieldError name="pribadi.kota_kabupaten" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.provinsi">Provinsi</Label>
            <TextInput id="pribadi.provinsi" name="pribadi.provinsi" defaultValue={sv(defaultValues.pribadi?.provinsi)} />
            <FieldError name="pribadi.provinsi" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.kode_pos">Kode Pos</Label>
            <TextInput id="pribadi.kode_pos" name="pribadi.kode_pos" defaultValue={sv(defaultValues.pribadi?.kode_pos)} />
            <FieldError name="pribadi.kode_pos" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.agama">Agama</Label>
            <SelectInput id="pribadi.agama" name="pribadi.agama" defaultValue={sv(defaultValues.pribadi?.agama)}>
              <option value="">-</option>
              <option>Islam</option>
              <option>Kristen</option>
              <option>Katolik</option>
              <option>Hindu</option>
              <option>Budha</option>
              <option>Khonghucu</option>
              <option>Lainnya</option>
            </SelectInput>
            <FieldError name="pribadi.agama" state={state} />
          </div>

          <div className="mb-4">
            <Label htmlFor="pribadi.status_perkawinan">Status Perkawinan</Label>
            <SelectInput id="pribadi.status_perkawinan" name="pribadi.status_perkawinan" defaultValue={sv(defaultValues.pribadi?.status_perkawinan)}>
              <option value="">-</option>
              <option value="Belum Kawin">Belum Kawin</option>
              <option value="Kawin">Kawin</option>
              <option value="CeraiHidup">CeraiHidup</option>
              <option value="CeraiMati">CeraiMati</option>
            </SelectInput>
            <FieldError name="pribadi.status_perkawinan" state={state} />
          </div>

          <div>
            <Label htmlFor="pribadi.kewarganegaraan">Kewarganegaraan</Label>
            <SelectInput id="pribadi.kewarganegaraan" name="pribadi.kewarganegaraan" defaultValue={sv(defaultValues.pribadi?.kewarganegaraan)}>
              <option value="">-</option>
              <option value="WNI">WNI</option>
              <option value="WNA">WNA</option>
            </SelectInput>
            <FieldError name="pribadi.kewarganegaraan" state={state} />
          </div>

          <div className="mb-0">
            <Label htmlFor="pribadi.pekerjaan">Pekerjaan</Label>
            <TextInput id="pribadi.pekerjaan" name="pribadi.pekerjaan" defaultValue={sv(defaultValues.pribadi?.pekerjaan)} />
            <FieldError name="pribadi.pekerjaan" state={state} />
          </div>
        </Section>
      )}

      {tipe === 'perusahaan' && (
        <Section title="Data Perusahaan">
          {/* <div className="mb-4">
            <Label htmlFor="perusahaan.nama_perusahaan">Nama Perusahaan</Label>
            <TextInput
              id="perusahaan.nama_perusahaan"
              name="perusahaan.nama_perusahaan"
              defaultValue={sv(defaultValues.perusahaan?.nama_perusahaan)}
              aria-describedby="perusahaan.nama_perusahaan-error"
            />
            <FieldError name="perusahaan.nama_perusahaan" state={state} />
          </div> */}
          <div className="mb-4">
            <Label htmlFor="perusahaan.npwp_perusahaan">NPWP Perusahaan</Label>
            <TextInput id="perusahaan.npwp_perusahaan" name="perusahaan.npwp_perusahaan" defaultValue={sv(defaultValues.perusahaan?.npwp_perusahaan)} aria-describedby="perusahaan.npwp_perusahaan-error" />
            <FieldError name="perusahaan.npwp_perusahaan" state={state} />
          </div>
          <div className="mb-4">
            <Label htmlFor="perusahaan.nama_pic">Nama PIC</Label>
            <TextInput id="perusahaan.nama_pic" name="perusahaan.nama_pic" defaultValue={sv(defaultValues.perusahaan?.nama_pic)} aria-describedby="perusahaan.nama_pic-error" />
            <FieldError name="perusahaan.nama_pic" state={state} />
          </div>
          <div className="mb-4">
            <Label htmlFor="perusahaan.jabatan_pic">Jabatan PIC</Label>
            <TextInput id="perusahaan.jabatan_pic" name="perusahaan.jabatan_pic" defaultValue={sv(defaultValues.perusahaan?.jabatan_pic)} aria-describedby="perusahaan.jabatan_pic-error" />
            <FieldError name="perusahaan.jabatan_pic" state={state} />
          </div>
          <div className="mb-0">
            <Label htmlFor="perusahaan.email_pic">Email PIC</Label>
            <TextInput id="perusahaan.email_pic" name="perusahaan.email_pic" type="email" defaultValue={sv(defaultValues.perusahaan?.email_pic)} aria-describedby="perusahaan.email_pic-error" />
            <FieldError name="perusahaan.email_pic" state={state} />
          </div>
        </Section>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/nasabah"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Batal
        </Link>
        {/* <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
        >
          Simpan DISINI!
        </button> */}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan…' : 'Simpan Nasabah'}
        </Button>
        {/* Submission feedback */}
        {state?.success && (
          <div className="mt-4 p-4 rounded-md bg-blue-50 text-blue-800">Berhasil menyimpan.</div>
        )}
        {!state?.success && state?.message && (
          <div className="mt-4 p-4 rounded-md bg-rose-50 text-rose-800">
            {state.message}
          </div>
        )}
        <FieldError name="rpc" state={state} />

      </div>
    </form>
  );
}

