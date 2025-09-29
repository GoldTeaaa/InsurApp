// features/polis/Step2.tsx
"use client";

import { useEffect } from "react";

type Props = {
  value: {
    no_polis: string;
    tanggal_terbit: string;
    bisnis: string;
    periode_polis: string;
    premi_gross: string;
    discount: string;
    biaya_admin_materai: string;
    premi_net: string; // derived visually
    cara_bayar: string;
    rekening_bank: string;
  };
  onChange: (v: Props["value"]) => void;
};

export default function Step2({ value, onChange }: Props) {
  // simple derived calc for demo
  useEffect(() => {
    const gross = parseFloat(value.premi_gross || "0");
    const disc = parseFloat(value.discount || "0");
    const admin = parseFloat(value.biaya_admin_materai || "0");
    const net = Math.max(0, gross - disc + admin).toString();
    if (net !== value.premi_net) onChange({ ...value, premi_net: net });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.premi_gross, value.discount, value.biaya_admin_materai]);

  return (
    <div className="space-y-6">
      <Section title="Detail Polis" subtitle="Informasi pokok polis.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="No. Polis">
            <input
              className="w-full rounded-md border-gray-300"
              value={value.no_polis}
              onChange={(e) => onChange({ ...value, no_polis: e.target.value })}
              placeholder="e.g. POL-2024-0001"
            />
          </Field>
          <Field label="Tanggal Terbit">
            <input
              type="date"
              className="w-full rounded-md border-gray-300"
              value={value.tanggal_terbit}
              onChange={(e) => onChange({ ...value, tanggal_terbit: e.target.value })}
            />
          </Field>
          <Field label="Bisnis">
            <input
              className="w-full rounded-md border-gray-300"
              value={value.bisnis}
              onChange={(e) => onChange({ ...value, bisnis: e.target.value })}
              placeholder="e.g. Health / Motor / Property"
            />
          </Field>
          <Field label="Periode Polis">
            <input
              className="w-full rounded-md border-gray-300"
              value={value.periode_polis}
              onChange={(e) => onChange({ ...value, periode_polis: e.target.value })}
              placeholder="e.g. 2024-2025"
            />
          </Field>
        </div>
      </Section>

      <Section title="Premi" subtitle="Hitung premi net (demo kalkulasi).">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Premi Gross">
            <input
              type="number"
              className="w-full rounded-md border-gray-300"
              value={value.premi_gross}
              onChange={(e) => onChange({ ...value, premi_gross: e.target.value })}
              placeholder="0"
            />
          </Field>
          <Field label="Discount">
            <input
              type="number"
              className="w-full rounded-md border-gray-300"
              value={value.discount}
              onChange={(e) => onChange({ ...value, discount: e.target.value })}
              placeholder="0"
            />
          </Field>
          <Field label="Biaya Admin & Materai">
            <input
              type="number"
              className="w-full rounded-md border-gray-300"
              value={value.biaya_admin_materai}
              onChange={(e) => onChange({ ...value, biaya_admin_materai: e.target.value })}
              placeholder="0"
            />
          </Field>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Premi Net (auto)" >
            <input className="w-full rounded-md border-gray-300 bg-gray-100" value={value.premi_net} readOnly />
          </Field>
          <Field label="Cara Bayar">
            <input
              className="w-full rounded-md border-gray-300"
              value={value.cara_bayar}
              onChange={(e) => onChange({ ...value, cara_bayar: e.target.value })}
              placeholder="Transfer / Cash / Giro"
            />
          </Field>
          <Field label="Rekening Bank">
            <input
              className="w-full rounded-md border-gray-300"
              value={value.rekening_bank}
              onChange={(e) => onChange({ ...value, rekening_bank: e.target.value })}
              placeholder="e.g. BCA 1234567890"
            />
          </Field>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
