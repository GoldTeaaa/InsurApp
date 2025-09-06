// features/polis/CreatePolisForm.tsx
"use client";

import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

type Step1Data = {
  nasabah_id: string;
  perusahaan_asuransi_id: string;
};

type Step2Data = {
  no_polis: string;
  tanggal_terbit: string;
  bisnis: string;
  periode_polis: string;
  premi_gross: string;
  discount: string;
  biaya_admin_materai: string;
  premi_net: string; // read-only (derived visually here)
  cara_bayar: string;
  rekening_bank: string;
};

type KomisiRow = {
  no_kwitansi_komisi: string;
  komisi_gross: string;
  pph_komisi: string;
  komisi_net: string; // derived visually here
};

type ShareRow = {
  perusahaan_asuransi_id: string;
  persentase_share: string;
  coas_role: "Leader" | "Follower";
  komisi: KomisiRow[];
};

type Step3Data = {
  shares: ShareRow[];
};

export default function CreatePolisForm() {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const [s1, setS1] = useState<Step1Data>({
    nasabah_id: "",
    perusahaan_asuransi_id: "",
  });

  const [s2, setS2] = useState<Step2Data>({
    no_polis: "",
    tanggal_terbit: "",
    bisnis: "",
    periode_polis: "",
    premi_gross: "",
    discount: "",
    biaya_admin_materai: "",
    premi_net: "",
    cara_bayar: "",
    rekening_bank: "",
  });

  const [s3, setS3] = useState<Step3Data>({
    shares: [],
  });

  const next = () => setStep((p) => (p < 2 ? ((p + 1) as any) : p));
  const back = () => setStep((p) => (p > 0 ? ((p - 1) as any) : p));

  const onSubmitDemo = () => {
    // Demo only: show what would be submitted
    console.log({ ...s1, ...s2, ...s3 });
    alert("Demo only: data logged to console.\n(Next step is wiring validation + RPC).");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Buat Polis</h1>
        <p className="text-sm text-gray-500">Demo UI 3 langkah (tanpa backend).</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-3 mb-6">
        {["Peserta & Penanggung", "Detail Polis & Premi", "Share & Komisi"].map((label, i) => (
          <div key={label} className="flex items-center">
            <div
              className={[
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step === i ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700",
              ].join(" ")}
            >
              {i + 1}
            </div>
            <span className={["ml-2 text-sm", step === i ? "text-blue-700" : "text-gray-500"].join(" ")}>
              {label}
            </span>
            {i < 2 && <div className="mx-3 h-px w-10 bg-gray-300" />}
          </div>
        ))}
      </div>

      {/* Panels */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {step === 0 && <Step1 value={s1} onChange={setS1} />}
        {step === 1 && <Step2 value={s2} onChange={setS2} />}
        {step === 2 && <Step3 value={s3} onChange={setS3} />}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          disabled={step === 0}
        >
          Kembali
        </button>

        {step < 2 ? (
          <button
            type="button"
            onClick={next}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Lanjut
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmitDemo}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit (Demo)
          </button>
        )}
      </div>
    </div>
  );
}
