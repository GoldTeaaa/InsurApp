// features/polis/Step1.tsx
"use client";

type Props = {
  value: {
    nasabah_id: string;
    perusahaan_asuransi_id: string;
  };
  onChange: (v: Props["value"]) => void;
};

export default function Step1({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <Section title="Peserta & Penanggung" subtitle="Pilih nasabah dan perusahaan asuransi.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nasabah" hint="Cari & pilih nasabah">
            <select
              className="w-full rounded-md border-gray-300"
              value={value.nasabah_id}
              onChange={(e) => onChange({ ...value, nasabah_id: e.target.value })}
            >
              <option value="">— Pilih Nasabah —</option>
              <option value="uuid-nasabah-1">PT Contoh Sejahtera</option>
              <option value="uuid-nasabah-2">Budi Santoso</option>
            </select>
            <div className="mt-2">
              <button type="button" className="text-blue-600 text-sm hover:underline">
                + Tambah Nasabah (modal)
              </button>
            </div>
          </Field>

          <Field label="Perusahaan Asuransi" hint="Cari & pilih penanggung">
            <select
              className="w-full rounded-md border-gray-300"
              value={value.perusahaan_asuransi_id}
              onChange={(e) => onChange({ ...value, perusahaan_asuransi_id: e.target.value })}
            >
              <option value="">— Pilih Perusahaan —</option>
              <option value="uuid-insurer-1">ABC Insurance</option>
              <option value="uuid-insurer-2">Definitas Life</option>
            </select>
            <div className="mt-2">
              <button type="button" className="text-blue-600 text-sm hover:underline">
                + Tambah Perusahaan (modal)
              </button>
            </div>
          </Field>
        </div>

        {/* Read-only preview cards (demo) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PreviewCard title="Nasabah Terpilih" lines={[`ID: ${value.nasabah_id || "-"}`]} />
          <PreviewCard title="Perusahaan Terpilih" lines={[`ID: ${value.perusahaan_asuransi_id || "-"}`]} />
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
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function PreviewCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="text-sm font-semibold mb-2">{title}</div>
      <ul className="text-sm text-gray-600 space-y-1">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
