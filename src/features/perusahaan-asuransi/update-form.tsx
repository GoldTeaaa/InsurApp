// features/perusahaan-asuransi/update-form.tsx
"use client";

import { useActionState, startTransition } from "react";
import { useForm } from "react-hook-form";
import type {
  PerusahaanPrefillUpdate,
  PerusahaanUpdateFormValues,
} from "@/lib/perusahaan_asuransi/types";
import {
  updatePerusahaanAction,
  type UpdateInsurerState,
} from "@/features/perusahaan-asuransi/actions/update-form";

type Props = {
  id: string;
  defaultValues: PerusahaanPrefillUpdate; // from perusahaan_asuransi_get_v1
};

export default function UpdatePerusahaanAsuransiForm({ id, defaultValues }: Props) {
  // Narrow to only the editable fields
  const formDefaults: PerusahaanUpdateFormValues = {
    id,
    nama: defaultValues.nama,
    email: defaultValues.email ?? "",
    alamat: defaultValues.alamat ?? "",
    kontak_1: defaultValues.kontak_1 ?? "",
    kontak_2: defaultValues.kontak_2 ?? "",
  };

  const { register, handleSubmit, formState } = useForm<PerusahaanUpdateFormValues>({
    defaultValues: formDefaults,
  });

  const [state, formAction] = useActionState<UpdateInsurerState, FormData>(
    updatePerusahaanAction,
    { ok: false, message: "" }
  );

  const onSubmit = (v: PerusahaanUpdateFormValues) => {
    const fd = new FormData();
    fd.append("id", v.id);
    fd.append("nama", v.nama);
    fd.append("email", v.email ?? "");
    fd.append("alamat", v.alamat ?? "");
    fd.append("kontak_1", v.kontak_1 ?? "");
    fd.append("kontak_2", v.kontak_2 ?? "");
    // Call the action inside a transition to avoid the warning
    startTransition(() => formAction(fd));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      noValidate
    >
      {/* Hidden id for server action */}
      <input type="hidden" {...register("id")} />

      <fieldset className="contents" disabled={formState.isSubmitting}>
        <div>
          <label className="block text-sm font-medium">Nama*</label>
          <input
            {...register("nama")}
            className="w-full rounded-md border px-3 py-2"
            aria-invalid={!!state.errors?.nama?.length}
          />
          {state.errors?.nama && (
            <p className="mt-1 text-sm text-red-600">{state.errors.nama.join(", ")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-md border px-3 py-2"
            aria-invalid={!!state.errors?.email?.length}
            autoComplete="email"
          />
          {state.errors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.errors.email.join(", ")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Kontak 1</label>
          <input
            {...register("kontak_1")}
            className="w-full rounded-md border px-3 py-2"
            aria-invalid={!!state.errors?.kontak_1?.length}
          />
          {state.errors?.kontak_1 && (
            <p className="mt-1 text-sm text-red-600">{state.errors.kontak_1.join(", ")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Kontak 2</label>
          <input
            {...register("kontak_2")}
            className="w-full rounded-md border px-3 py-2"
            aria-invalid={!!state.errors?.kontak_2?.length}
          />
          {state.errors?.kontak_2 && (
            <p className="mt-1 text-sm text-red-600">{state.errors.kontak_2.join(", ")}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Alamat</label>
          <textarea
            rows={3}
            {...register("alamat")}
            className="w-full rounded-md border px-3 py-2"
            aria-invalid={!!state.errors?.alamat?.length}
            autoComplete="street-address"
          />
          {state.errors?.alamat && (
            <p className="mt-1 text-sm text-red-600">{state.errors.alamat.join(", ")}</p>
          )}
        </div>
      </fieldset>

      {/* Global status */}
      {state.message && (
        <div
          className={`md:col-span-2 text-sm ${
            state.ok ? "text-green-700" : "text-red-700"
          }`}
          aria-live="polite"
        >
          {state.message}
        </div>
      )}

      <div className="md:col-span-2">
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
