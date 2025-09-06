// features/polis/Step3.tsx
"use client";

import { useMemo } from "react";

type KomisiRow = {
  no_kwitansi_komisi: string;
  komisi_gross: string;
  pph_komisi: string;
  komisi_net: string; // derived visually
};

type ShareRow = {
  perusahaan_asuransi_id: string;
  persentase_share: string;
  coas_role: "Leader" | "Follower";
  komisi: KomisiRow[];
};

type Props = {
  value: { shares: ShareRow[] };
  onChange: (v: { shares: ShareRow[] }) => void;
};

export default function Step3({ value, onChange }: Props) {
  const totalShare = useMemo(
    () =>
      value.shares.reduce((acc, s) => acc + (parseFloat(s.persentase_share || "0") || 0), 0),
    [value.shares]
  );

  const addShare = () => {
    onChange({
      shares: [
        ...value.shares,
        {
          perusahaan_asuransi_id: "",
          persentase_share: "",
          coas_role: "Follower",
          komisi: [],
        },
      ],
    });
  };

  const removeShare = (idx: number) => {
    const next = value.shares.slice();
    next.splice(idx, 1);
    onChange({ shares: next });
  };

  const updateShare = (idx: number, patch: Partial<ShareRow>) => {
    const next = value.shares.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange({ shares: next });
  };

  const addKomisi = (sIdx: number) => {
    const next = value.shares.slice();
    const arr = next[sIdx].komisi.slice();
    arr.push({
      no_kwitansi_komisi: "",
      komisi_gross: "",
      pph_komisi: "",
      komisi_net: "",
    });
    next[sIdx].komisi = arr;
    onChange({ shares: next });
  };

  const updateKomisi = (sIdx: number, kIdx: number, patch: Partial<KomisiRow>) => {
    const next = value.shares.slice();
    const rows = next[sIdx].komisi.slice();
    const gross = parseFloat((patch.komisi_gross ?? rows[kIdx].komisi_gross) || "0");
    const pph = parseFloat((patch.pph_komisi ?? rows[kIdx].pph_komisi) || "0");
    const net = (gross - pph).toString();
    rows[kIdx] = { ...rows[kIdx], ...patch, komisi_net: net };
    next[sIdx].komisi = rows;
    onChange({ shares: next });
  };

  const removeKomisi = (sIdx: number, kIdx: number) => {
    const next = value.shares.slice();
    const rows = next[sIdx].komisi.slice();
    rows.splice(kIdx, 1);
    next[sIdx].komisi = rows;
    onChange({ shares: next });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Share & Komisi</h2>
          <p className="text-sm text-gray-500">
            Tambahkan pembagian share per perusahaan. Total share target 100.
          </p>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={addShare}
            className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
          >
            + Tambah Share
          </button>
          <span className={["text-sm", totalShare === 100 ? "text-green-600" : "text-amber-600"].join(" ")}>
            Total Share: <b>{Number.isFinite(totalShare) ? totalShare : 0}</b>%
          </span>
        </div>

        <div className="space-y-4">
          {value.shares.length === 0 && (
            <div className="text-sm text-gray-500">Belum ada share. Klik “Tambah Share”.</div>
          )}

          {value.shares.map((s, sIdx) => (
            <div key={sIdx} className="rounded-xl border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Field label="Perusahaan Asuransi">
                  <select
                    className="w-full rounded-md border-gray-300"
                    value={s.perusahaan_asuransi_id}
                    onChange={(e) => updateShare(sIdx, { perusahaan_asuransi_id: e.target.value })}
                  >
                    <option value="">— Pilih —</option>
                    <option value="uuid-insurer-1">ABC Insurance</option>
                    <option value="uuid-insurer-2">Definitas Life</option>
                  </select>
                </Field>
                <Field label="% Share">
                  <input
                    type="number"
                    className="w-full rounded-md border-gray-300"
                    value={s.persentase_share}
                    onChange={(e) => updateShare(sIdx, { persentase_share: e.target.value })}
                    placeholder="0"
                  />
                </Field>
                <Field label="Role">
                  <select
                    className="w-full rounded-md border-gray-300"
                    value={s.coas_role}
                    onChange={(e) => updateShare(sIdx, { coas_role: e.target.value as any })}
                  >
                    <option value="Leader">Leader</option>
                    <option value="Follower">Follower</option>
                  </select>
                </Field>

                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => removeShare(sIdx)}
                    className="px-3 py-1.5 rounded-md border border-red-300 text-red-600 text-sm hover:bg-red-50"
                  >
                    Hapus Share
                  </button>
                </div>
              </div>

              {/* Komisi rows */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium">Detail Komisi</div>
                  <button
                    type="button"
                    onClick={() => addKomisi(sIdx)}
                    className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
                  >
                    + Tambah Komisi
                  </button>
                </div>

                {s.komisi.length === 0 && (
                  <div className="text-sm text-gray-500">Belum ada komisi.</div>
                )}

                <div className="space-y-3">
                  {s.komisi.map((k, kIdx) => (
                    <div key={kIdx} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Field label="No. Kwitansi">
                        <input
                          className="w-full rounded-md border-gray-300"
                          value={k.no_kwitansi_komisi}
                          onChange={(e) =>
                            updateKomisi(sIdx, kIdx, { no_kwitansi_komisi: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Komisi Gross">
                        <input
                          type="number"
                          className="w-full rounded-md border-gray-300"
                          value={k.komisi_gross}
                          onChange={(e) =>
                            updateKomisi(sIdx, kIdx, { komisi_gross: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="PPh Komisi">
                        <input
                          type="number"
                          className="w-full rounded-md border-gray-300"
                          value={k.pph_komisi}
                          onChange={(e) =>
                            updateKomisi(sIdx, kIdx, { pph_komisi: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Komisi Net (auto)">
                        <input className="w-full rounded-md border-gray-300 bg-gray-100" value={k.komisi_net} readOnly />
                      </Field>

                      <div className="md:col-span-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeKomisi(sIdx, kIdx)}
                          className="px-3 py-1.5 rounded-md border border-red-300 text-red-600 text-sm hover:bg-red-50"
                        >
                          Hapus Baris Komisi
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
