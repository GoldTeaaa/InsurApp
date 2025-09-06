// features/perusahaan_asuransi/create-form.tsx
'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPerusahaanAction, type CreatePerusahaanState } from '@/features/perusahaan-asuransi/actions/create';

function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className="mb-1 block text-sm font-medium text-gray-700" />;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
    />
  );
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
    />
  );
}
function Field({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}
function ErrorText({ id, message }: { id: string; message?: string[] }) {
  if (!message || message.length === 0) return null;
  return (
    <p id={id} className="mt-1 text-xs text-red-600">
      {message[0]}
    </p>
  );
}
function getErr(state: CreatePerusahaanState | null, name: string): string[] | undefined {
  return state?.errors?.[name];
}

export default function CreatePerusahaanForm() {
  const router = useRouter();
  const initial: CreatePerusahaanState = { success: false, message: null, errors: {} };

  const [state, formAction, isPending] = useActionState(createPerusahaanAction, initial);

  useEffect(() => {
    if (state?.success && state?.nama) {
      // Redirect to list, pre-filtered by the new name
      const sp = new URLSearchParams({ q: state.nama, page: '1', sort: 'created_desc' });
      router.push(`/perusahaan?${sp.toString()}`);
    }
  }, [state?.success, state?.nama, router]);

  return (
    <form action={formAction} className="max-w-xl rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Tambah Perusahaan Asuransi</h2>

      {/* Global error (non-field) */}
      {!state?.success && state?.message && !state?.errors && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <Field>
        <Label htmlFor="nama">Nama Perusahaan<span className="text-red-600"> *</span></Label>
        <Input
          id="nama"
          name="nama"
          placeholder="PT Contoh Asuransi"
          required
          minLength={3}
          aria-describedby="err-nama"
          disabled={isPending}
        />
        <ErrorText id="err-nama" message={getErr(state, 'nama')} />
      </Field>

      <Field>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="finance@contoh.co.id"
          aria-describedby="err-email"
          disabled={isPending}
        />
        <ErrorText id="err-email" message={getErr(state, 'email')} />
      </Field>

      <Field>
        <Label htmlFor="kontak_1">Kontak 1</Label>
        <Input id="kontak_1" name="kontak_1" placeholder="021-123456" disabled={isPending} />
        <ErrorText id="err-kontak_1" message={getErr(state, 'kontak_1')} />
      </Field>

      <Field>
        <Label htmlFor="kontak_2">Kontak 2</Label>
        <Input id="kontak_2" name="kontak_2" placeholder="0812-xxxx-xxxx" disabled={isPending} />
        <ErrorText id="err-kontak_2" message={getErr(state, 'kontak_2')} />
      </Field>

      <Field>
        <Label htmlFor="alamat">Alamat</Label>
        <Textarea id="alamat" name="alamat" rows={3} placeholder="Jl. Mawar No. 1, Jakarta" disabled={isPending} />
        <ErrorText id="err-alamat" message={getErr(state, 'alamat')} />
      </Field>

      {/* RPC-level error bucket (if any) */}
      <ErrorText id="err-rpc" message={getErr(state, 'rpc')} />

      <div className="mt-6 flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Menyimpan…' : 'Simpan'}
        </button>
        <button
          type="reset"
          disabled={isPending}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
