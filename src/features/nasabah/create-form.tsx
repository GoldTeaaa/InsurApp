'use client';

import * as React from 'react';
import { useActionState } from 'react';
import insertNasabah from './actions';

// --- UI Primitives ---
// These components provide consistent styling for our form elements.

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    />
  );
}

function FormField({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
    />
  );
}

// --- Main Form Component ---

type Tipe = 'pribadi' | 'perusahaan';

export default function NasabahForm() {
  const [state, formAction, isPending] = useActionState(insertNasabah, null);

  // State management for form fields
  const [tipe, setTipe] = React.useState<Tipe>('pribadi');
  const [nomorTelfon, setNomorTelfon] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [alamat, setAlamat] = React.useState('');
  const [namaLengkap, setNamaLengkap] = React.useState('');
  const [noKtp, setNoKtp] = React.useState('');
  const [tanggalLahir, setTanggalLahir] = React.useState('');
  const [namaPerusahaan, setNamaPerusahaan] = React.useState('');
  const [picNama, setPicNama] = React.useState('');
  const [noKtpPic, setNoKtpPic] = React.useState('');

  function handleChangeTipe(next: Tipe) {
    setTipe(next);
    if (next === 'pribadi') {
      setNamaPerusahaan('');
      setPicNama('');
      setNoKtpPic('');
    } else {
      setNamaLengkap('');
      setNoKtp('');
      setTanggalLahir('');
    }
  }

  function handleValidSubmit(ev: React.FormEvent<HTMLFormElement>) {
    const payloadInput = ev.currentTarget.querySelector<HTMLInputElement>('input[name="payload"]');
    if (!payloadInput) return;

    const base = {
      tipe,
      nomor_telfon: nomorTelfon || undefined,
      email: email || undefined,
      alamat: alamat || undefined,
    };

    const payload =
      tipe === 'pribadi'
        ? { ...base, pribadi: { nama_lengkap: namaLengkap || '', no_ktp: noKtp || '', tanggal_lahir: tanggalLahir || undefined } }
        : { ...base, perusahaan: { nama_perusahaan: namaPerusahaan || '', pic_nama: picNama || '', no_ktp_pic: noKtpPic || undefined } };

    payloadInput.value = JSON.stringify(payload);
  }

  return (
    <form action={formAction} onSubmit={handleValidSubmit} className="max-w-xl mx-auto space-y-6 p-4 sm:p-6">
      <input type="hidden" name="payload" />

      <fieldset className="space-y-2">
        <legend className="text-lg font-medium">Tipe Nasabah</legend>
        <div className="flex items-center gap-x-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="tipe" value="pribadi" checked={tipe === 'pribadi'} onChange={() => handleChangeTipe('pribadi')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
            Pribadi
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="tipe" value="perusahaan" checked={tipe === 'perusahaan'} onChange={() => handleChangeTipe('perusahaan')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
            Perusahaan
          </label>
        </div>
      </fieldset>

      {tipe === 'pribadi' ? (
        <fieldset className="border-t pt-6 space-y-4">
          <legend className="text-base font-medium text-gray-900">Identitas Pribadi</legend>
          <FormField>
            <Label htmlFor="namaLengkap">Nama Lengkap*</Label>
            <Input id="namaLengkap" type="text" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} placeholder="Budi Santoso" required />
          </FormField>
          <FormField>
            <Label htmlFor="noKtp">No. KTP*</Label>
            <Input id="noKtp" type="text" value={noKtp} onChange={(e) => setNoKtp(e.target.value)} placeholder="3174..." required />
          </FormField>
          <FormField>
            <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
            <Input id="tanggalLahir" type="date" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} />
          </FormField>
        </fieldset>
      ) : (
        <fieldset className="border-t pt-6 space-y-4">
          <legend className="text-base font-medium text-gray-900">Identitas Perusahaan</legend>
          <FormField>
            <Label htmlFor="namaPerusahaan">Nama Perusahaan*</Label>
            <Input id="namaPerusahaan" type="text" value={namaPerusahaan} onChange={(e) => setNamaPerusahaan(e.target.value)} placeholder="PT Contoh Abadi" required />
          </FormField>
          <FormField>
            <Label htmlFor="picNama">PIC Nama*</Label>
            <Input id="picNama" type="text" value={picNama} onChange={(e) => setPicNama(e.target.value)} placeholder="Andi Saputra" required />
          </FormField>
          <FormField>
            <Label htmlFor="noKtpPic">No. KTP PIC</Label>
            <Input id="noKtpPic" type="text" value={noKtpPic} onChange={(e) => setNoKtpPic(e.target.value)} placeholder="3201..." />
          </FormField>
        </fieldset>
      )}

      <fieldset className="border-t pt-6 space-y-4">
        <legend className="text-base font-medium text-gray-900">Informasi Kontak</legend>
        <FormField>
          <Label htmlFor="nomorTelfon">Nomor Telepon*</Label>
          <Input id="nomorTelfon" type="text" value={nomorTelfon} onChange={(e) => setNomorTelfon(e.target.value)} placeholder="0812..." required />
        </FormField>
        <FormField>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@contoh.id" />
        </FormField>
        <FormField>
          <Label htmlFor="alamat">Alamat</Label>
          <Textarea id="alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Jl. Merdeka No.1" rows={3} />
        </FormField>
      </fieldset>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan…' : 'Simpan Nasabah'}
        </Button>
      </div>

      {state && typeof state === 'object' && 'ok' in state && (
        <div className="mt-4 p-4 rounded-md" style={{ backgroundColor: state.ok ? '#e0f2fe' : '#ffe4e6' }}>
          {state.ok ? (
            <div className="text-blue-800">Berhasil menyimpan.</div>
          ) : (
            <div className="text-red-800">
              <p className="font-semibold">Gagal: {state.error}</p>
              {state.issues && (
                <pre className="mt-2 text-xs whitespace-pre-wrap">{JSON.stringify(state.issues, null, 2)}</pre>
              )}
            </div>
          )}
        </div>
      )}
    </form>
  );
}