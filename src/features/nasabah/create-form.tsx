'use client';

import { useActionState, useState } from 'react';
import insertNasabah, { type State } from './actions';

/* Minimal UI primitives */
function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className="block text-sm font-medium text-gray-700 mb-1" />;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
    />
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
    />
  );
}

function ErrorText({ id, message }: { id: string; message?: string[] }) {
  if (!message || message.length === 0) return null;
  return (
    <p id={id} className="mt-1 text-xs text-red-600">
      {message[0]}
    </p>
  );
}

/** Small helper to read error array by field name */
function getErr(state: State | null, name: string): string[] | undefined {
  return state?.errors?.[name];
}

type Props = {
  tipe: 'pribadi' | 'perusahaan';
  onTipeChange: (tipe: 'pribadi' | 'perusahaan') => void;
}

export default function NasabahCreateForm({ tipe, onTipeChange }: Props) {
  const initial: State = {
    message: null,
    errors: {},
    success: false
  };
  const [state, formAction, isPending] = useActionState(insertNasabah, initial);

  // Utility to connect input to an error block
  const aria = (name: string) => {
    const hasError = Boolean(getErr(state, name)?.length);
    const errId = `${name.replaceAll('.', '-')}-error`;
    return {
      attrs: {
        'aria-invalid': hasError || undefined,
        'aria-describedby': hasError ? errId : undefined,
      },
      errId,
    } as const;
  };


  return (
    <form action={formAction} className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Tipe */}
      <input type="hidden" name="tipe" value={tipe} />

      <fieldset
        className="space-y-2"
        // 3) remount radios when outcome flips, avoids stale browser UI
        key={`${tipe}|${state?.success ? 'ok' : 'idle'}`}
      >
        <legend className="text-lg font-medium">Tipe Nasabah</legend>
        <div className="flex items-center gap-x-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tipe-radio"                 // 2) different name
              value="pribadi"
              checked={tipe === 'pribadi'}   // fully controlled by prop
              onChange={() => onTipeChange('pribadi')}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
            />
            Pribadi
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tipe-radio"                 // 2) different name
              value="perusahaan"
              checked={tipe === 'perusahaan'}
              onChange={() => onTipeChange('perusahaan')}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
            />
            Perusahaan
          </label>
        </div>
      </fieldset>

      {/* Cabang: Pribadi */}
      {tipe === 'pribadi' ? (
        <fieldset className="border-t pt-6">
          <legend className="text-base font-medium text-gray-900 mb-4">Identitas Pribadi</legend>

          <Field>
            <Label htmlFor="nama">Nama Tertanggung*</Label>
            <Input
              id="nama"
              name="nama"
              required
              {...aria('nama')}
            />
            <ErrorText id={aria('nama').errId} message={getErr(state, 'nama')} />
          </Field>

          <Field>
            <Label htmlFor="pribadi.nik">NIK*</Label>
            <Input
              id="pribadi.nik"
              name="pribadi.nik"
              required
              {...aria('pribadi.nik')}
            />
            <ErrorText id={aria('pribadi.nik').errId} message={getErr(state, 'pribadi.nik')} />
          </Field>

          <Field>
            <Label htmlFor="pribadi.tempat_lahir">Tempat Lahir*</Label>
            <Input
              id="pribadi.tempat_lahir"
              name="pribadi.tempat_lahir"
              required
              {...aria('pribadi.tempat_lahir')}
            />
            <ErrorText id={aria('pribadi.tempat_lahir').errId} message={getErr(state, 'pribadi.tempat_lahir')} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field>
              <Label htmlFor="pribadi.tanggal_lahir">Tanggal Lahir*</Label>
              <Input
                id="pribadi.tanggal_lahir"
                name="pribadi.tanggal_lahir"
                type="date"
                required
                {...aria('pribadi.tanggal_lahir')}
              />
              <ErrorText id={aria('pribadi.tanggal_lahir').errId} message={getErr(state, 'pribadi.tanggal_lahir')} />
            </Field>

            <Field>
              <Label htmlFor="pribadi.jenis_kelamin">Jenis Kelamin*</Label>
              <select
                id="pribadi.jenis_kelamin"
                name="pribadi.jenis_kelamin"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                {...aria('pribadi.jenis_kelamin')}
              >
                <option value="">Pilih</option>
                <option value="L">L</option>
                <option value="P">P</option>
              </select>
              <ErrorText id={aria('pribadi.jenis_kelamin').errId} message={getErr(state, 'pribadi.jenis_kelamin')} />
            </Field>

            <Field>
              <Label htmlFor="pribadi.pekerjaan">Pekerjaan</Label>
              <Input
                id="pribadi.pekerjaan"
                name="pribadi.pekerjaan"
                {...aria('pribadi.pekerjaan')}
              />
              <ErrorText id={aria('pribadi.pekerjaan').errId} message={getErr(state, 'pribadi.pekerjaan')} />
            </Field>
          </div>

          <Field>
            <Label htmlFor="pribadi.alamat_ktp">Alamat KTP</Label>
            <Textarea
              id="pribadi.alamat_ktp"
              name="pribadi.alamat_ktp"
              rows={2}
              {...aria('pribadi.alamat_ktp')}
            />
            <ErrorText id={aria('pribadi.alamat_ktp').errId} message={getErr(state, 'pribadi.alamat_ktp')} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <Field>
              <Label htmlFor="pribadi.rt">RT</Label>
              <Input id="pribadi.rt" name="pribadi.rt" />
            </Field>
            <Field>
              <Label htmlFor="pribadi.rw">RW</Label>
              <Input id="pribadi.rw" name="pribadi.rw" />
            </Field>
            <Field>
              <Label htmlFor="pribadi.kelurahan_desa">Kelurahan/Desa</Label>
              <Input
                id="pribadi.kelurahan_desa"
                name="pribadi.kelurahan_desa"
              />
            </Field>
            <Field>
              <Label htmlFor="pribadi.kecamatan">Kecamatan</Label>
              <Input id="pribadi.kecamatan" name="pribadi.kecamatan" />
            </Field>
            <Field>
              <Label htmlFor="pribadi.kota_kabupaten">Kota/Kabupaten</Label>
              <Input
                id="pribadi.kota_kabupaten"
                name="pribadi.kota_kabupaten"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <Label htmlFor="pribadi.agama">Agama</Label>
              <select
                id="pribadi.agama"
                name="pribadi.agama"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                {...aria('pribadi.agama')}
              >
                <option value="">Pilih</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Budha">Budha</option>
                <option value="Khonghucu">Khonghucu</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <ErrorText id={aria('pribadi.agama').errId} message={getErr(state, 'pribadi.agama')} />
            </Field>

            <Field>
              <Label htmlFor="pribadi.status_perkawinan">Status Perkawinan</Label>
              <select
                id="pribadi.status_perkawinan"
                name="pribadi.status_perkawinan"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                {...aria('pribadi.status_perkawinan')}
              >
                <option value="">Pilih</option>
                <option value="Belum Kawin">Belum Kawin</option>
                <option value="Kawin">Kawin</option>
                <option value="CeraiHidup">Cerai Hidup</option>
                <option value="CeraiMati">Cerai Mati</option>
              </select>
              <ErrorText id={aria('pribadi.status_perkawinan').errId} message={getErr(state, 'pribadi.status_perkawinan')} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field>
              <Label htmlFor="pribadi.provinsi">Provinsi</Label>
              <Input id="pribadi.provinsi" name="pribadi.provinsi" />
            </Field>
            <Field>
              <Label htmlFor="pribadi.kode_pos">Kode Pos</Label>
              <Input id="pribadi.kode_pos" name="pribadi.kode_pos" />
            </Field>
            <Field>
              <Label htmlFor="pribadi.kewarganegaraan">Kewarganegaraan</Label>
              <select
                id="pribadi.kewarganegaraan"
                name="pribadi.kewarganegaraan"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                {...aria('pribadi.kewarganegaraan')}
              >
                <option value="">Pilih</option>
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
              <ErrorText id={aria('pribadi.kewarganegaraan').errId} message={getErr(state, 'pribadi.kewarganegaraan')} />
            </Field>
          </div>
        </fieldset>
      ) : (
        // Cabang: Perusahaan
        <fieldset className="border-t pt-6">
          <legend className="text-base font-medium text-gray-900 mb-4">Identitas Perusahaan</legend>

          <Field>
            <Label htmlFor="nama">Nama Perusahaan*</Label>
            <Input
              id="nama"
              name="nama"
              required
              {...aria('nama')}
            />
            <ErrorText id={aria('nama').errId} message={getErr(state, 'nama')} />
          </Field>

          <Field>
            <Label htmlFor="perusahaan.npwp_perusahaan">NPWP Perusahaan*</Label>
            <Input
              id="perusahaan.npwp_perusahaan"
              name="perusahaan.npwp_perusahaan"
              required
              {...aria('perusahaan.npwp_perusahaan')}
            />
            <ErrorText id={aria('perusahaan.npwp_perusahaan').errId} message={getErr(state, 'perusahaan.npwp_perusahaan')} />
          </Field>

          <Field>
            <Label htmlFor="perusahaan.nama_pic">Nama PIC*</Label>
            <Input
              id="perusahaan.nama_pic"
              name="perusahaan.nama_pic"
              required
              {...aria('perusahaan.nama_pic')}
            />
            <ErrorText id={aria('perusahaan.nama_pic').errId} message={getErr(state, 'perusahaan.nama_pic')} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <Label htmlFor="perusahaan.jabatan_pic">Jabatan PIC</Label>
              <Input
                id="perusahaan.jabatan_pic"
                name="perusahaan.jabatan_pic"
                {...aria('perusahaan.jabatan_pic')}
              />
              <ErrorText id={aria('perusahaan.jabatan_pic').errId} message={getErr(state, 'perusahaan.jabatan_pic')} />
            </Field>
            <Field>
              <Label htmlFor="perusahaan.email_pic">Email PIC</Label>
              <Input
                id="perusahaan.email_pic"
                name="perusahaan.email_pic"
                type="email"
                {...aria('perusahaan.email_pic')}
              />
              <ErrorText id={aria('perusahaan.email_pic').errId} message={getErr(state, 'perusahaan.email_pic')} />
            </Field>
          </div>
        </fieldset>
      )}

      {/* Kontak & Alamat Umum */}
      <fieldset className="border-t pt-6">
        <legend className="text-base font-medium text-gray-900 mb-4">Kontak</legend>

        <Field>
          <Label htmlFor="contact_1">Kontak utama*</Label>
          <Input
            id="contact_1"
            name="contact_1"
            required
            {...aria('contact_1')}
          />
          <ErrorText id={aria('contact_1').errId} message={getErr(state, 'contact_1')} />
        </Field>

        <Field>
          <Label htmlFor="contact_2">Kontak tambahan</Label>
          <Input
            id="contact_2"
            name="contact_2"
            {...aria('contact_2')}
          />
          <ErrorText id={aria('contact_2').errId} message={getErr(state, 'contact_2')} />
        </Field>

        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            {...aria('email')}
          />
          <ErrorText id={aria('email').errId} message={getErr(state, 'email')} />
        </Field>

        <Field>
          <Label htmlFor="alamat">Alamat</Label>
          <Textarea
            id="alamat"
            name="alamat"
            rows={3}
            {...aria('alamat')}
          />
          <ErrorText id={aria('alamat').errId} message={getErr(state, 'alamat')} />
        </Field>
      </fieldset>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan…' : 'Simpan Nasabah'}
        </Button>
      </div>

      {/* Submission feedback */}
      {state?.success && (
        <div className="mt-4 p-4 rounded-md bg-blue-50 text-blue-800">Berhasil menyimpan.</div>
      )}
      {!state?.success && state?.message && (
        <div className="mt-4 p-4 rounded-md bg-rose-50 text-rose-800">{state.message}</div>
      )}
    </form>
  );
}