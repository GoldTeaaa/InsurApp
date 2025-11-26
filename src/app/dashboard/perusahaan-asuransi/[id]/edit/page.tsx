import { notFound } from "next/navigation";
import { getPerusahaanAsuransiById } from "@/features/perusahaan-asuransi/actions/prefill-update-form";
import PerusahaanAsuransiForm from "@/features/perusahaan-asuransi/PerusahaanAsuransiForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prefill = await getPerusahaanAsuransiById(id);
  if (!prefill.success) {
    throw new Error(prefill.message);
  };
  const data = prefill.data ?? notFound();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Edit Perusahaan Asuransi</h1>
      <PerusahaanAsuransiForm 
        mode="update"
        id={id}
        prefillData={data}
      />
    </div>
  );
}