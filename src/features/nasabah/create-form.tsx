'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  nasabahFormSchema,
  type NasabahFormData,
} from '@/lib/nasabah/types';

import { createNasabahAction } from '@/features/nasabah/actions';

// Minimal UI primitives
function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">{children}</label>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${props.className || ''}`} />;
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${props.className || ''}`} />;
}
function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`rounded-xl px-3.5 py-2.5 font-medium bg-black text-white disabled:opacity-60 ${props.className || ''}`} />;
}

function Segmented({
  value,
  onChange,
}: {
  value: 'pribadi' | 'perusahaan';
  onChange: (val: 'pribadi' | 'perusahaan') => void;
}) {
  return (
    <div className="inline-grid grid-cols-2 rounded-2xl border p-0.5">
      {(['pribadi', 'perusahaan'] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-2xl text-sm font-medium ${
            value === opt ? 'bg-white shadow border' : ''
          }`}
        >
          {opt === 'pribadi' ? 'Pribadi' : 'Perusahaan'}
        </button>
      ))}
    </div>
  );
}

export default function NasabahForm() {
  const [state, formAction, isPending] = useActionState(createNasabahAction, null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NasabahFormData>({
    resolver: zodResolver(nasabahFormSchema),
    defaultValues: {
      tipe: 'pribadi',
      nomor_telfon: '',
      email: null,
      alamat: null,
      pribadi: { nama_lengkap: '', no_ktp: '', tanggal_lahir: '' },
    } as any,
    mode: 'onBlur',
  });

  const tipe = watch('tipe');

  // Build a submit handler that sets the hidden JSON 'payload' before native submit
  function onValid(values: NasabahFormData, ev?: React.BaseSyntheticEvent) {
    const formEl = ev?.target as HTMLFormElement;
    const payloadInput = formEl.querySelector('input[name="payload"]') as HTMLInputElement;
    payloadInput.value = JSON.stringify(values);
    // Let the browser continue with native submit to formAction
  }

  React.useEffect(() => {
    if (state?.ok) {
      alert('Nasabah tersimpan.');
      reset({
        tipe,
        ...(tipe === 'pribadi'
          ? { nomor_telfon: '', email: null, alamat: null, pribadi: { nama_lengkap: '', no_ktp: '', tanggal_lahir: '' } }
          : { nomor_telfon: '', email: null, alamat: null, perusahaan: { nama_perusahaan: '', pic_nama: '', no_ktp_pic: '' } }),
      } as any);
    } else if (state?.error) {
      alert(`Gagal menyimpan.\n${state.error}`);
    }
  }, [state, reset, tipe]);

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit(onValid)}
      className="mx-auto max-w-3xl space-y-8"
    >
      <input type="hidden" name="payload" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tambah Nasabah</h1>
          <p className="text-sm text-gray-500">Isi data nasabah sesuai tipe.</p>
        </div>
        <Segmented
          value={tipe}
          onChange={(val) => {
            setValue('tipe', val);
            if (val === 'pribadi') {
              setValue('perusahaan', undefined as any);
              setValue('pribadi', { nama_lengkap: '', no_ktp: '', tanggal_lahir: '' } as any);
            } else {
              setValue('pribadi', undefined as any);
              setValue('perusahaan', { nama_perusahaan: '', pic_nama: '', no_ktp_pic: '' } as any);
            }
          }}
        />
      </div>

      {tipe === 'pribadi' ? (
        <div className="rounded-2xl border p-4 space-y-4">
          <h2 className="text-sm font-semibold">Identitas Pribadi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nama_lengkap">Nama Lengkap*</Label>
              <Input id="nama_lengkap" placeholder="Budi Santoso" {...register('pribadi.nama_lengkap')} />
              {errors?.pribadi?.nama_lengkap && <p className="mt-1 text-xs text-red-500">{errors.pribadi.nama_lengkap.message}</p>}
            </div>
            <div>
              <Label htmlFor="no_ktp">No. KTP*</Label>
              <Input id="no_ktp" placeholder="3174…" {...register('pribadi.no_ktp')} />
              {errors?.pribadi?.no_ktp && <p className="mt-1 text-xs text-red-500">{errors.pribadi.no_ktp.message}</p>}
            </div>
            <div>
              <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
              <Input id="tanggal_lahir" type="date" {...register('pribadi.tanggal_lahir')} />
              {errors?.pribadi?.tanggal_lahir && <p className="mt-1 text-xs text-red-500">{errors.pribadi.tanggal_lahir.message}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border p-4 space-y-4">
          <h2 className="text-sm font-semibold">Identitas Perusahaan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nama_perusahaan">Nama Perusahaan*</Label>
              <Input id="nama_perusahaan" placeholder="PT Contoh Abadi" {...register('perusahaan.nama_perusahaan')} />
              {errors?.perusahaan?.nama_perusahaan && <p className="mt-1 text-xs text-red-500">{errors.perusahaan.nama_perusahaan.message}</p>}
            </div>
            <div>
              <Label htmlFor="pic_nama">PIC Nama*</Label>
              <Input id="pic_nama" placeholder="Andi Saputra" {...register('perusahaan.pic_nama')} />
              {errors?.perusahaan?.pic_nama && <p className="mt-1 text-xs text-red-500">{errors.perusahaan.pic_nama.message}</p>}
            </div>
            <div>
              <Label htmlFor="no_ktp_pic">No. KTP PIC</Label>
              <Input id="no_ktp_pic" placeholder="3201…" {...register('perusahaan.no_ktp_pic')} />
              {errors?.perusahaan?.no_ktp_pic && <p className="mt-1 text-xs text-red-500">{errors.perusahaan.no_ktp_pic.message}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border p-4 space-y-4">
        <h2 className="text-sm font-semibold">Kontak</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nomor_telfon">Nomor Telepon*</Label>
            <Input id="nomor_telfon" placeholder="0812…" {...register('nomor_telfon')} />
            {errors?.nomor_telfon && <p className="mt-1 text-xs text-red-500">{errors.nomor_telfon.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="nama@contoh.id" {...register('email')} />
            {errors?.email && <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Textarea id="alamat" placeholder="Jl. Merdeka No. 1" rows={3} {...register('alamat')} />
            {errors?.alamat && <p className="mt-1 text-xs text-red-500">{errors.alamat.message as string}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan…' : 'Simpan Nasabah'}
        </Button>
        <Button
          type="button"
          className="bg-gray-200 text-gray-900"
          onClick={() => reset(undefined)}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
