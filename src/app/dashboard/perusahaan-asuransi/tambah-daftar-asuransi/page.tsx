import PerusahaanAsuransiForm from "@/features/perusahaan-asuransi/PerusahaanAsuransiForm";

export default function Page() {
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6">
        Tambah Perusahaan Asuransi
      </h1>
      <div className="max-w-2xl bg-white p-6 rounded-lg border shadow-sm">
        <PerusahaanAsuransiForm mode="create" />
      </div>
    </div>
  );
}