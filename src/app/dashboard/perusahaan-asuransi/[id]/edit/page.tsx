// "use client";
import UpdatePerusahaanAsuransiForm from "@/features/perusahaan-asuransi/update-form";
import { notFound } from "next/navigation";
import { getPerusahaanAsuransiById } from "@/features/perusahaan-asuransi/actions/prefill-update-form";

type id = { id: string };

export default async function Page({ params }: { params: id }) {
  const { id } = await params;
  const prefill = await getPerusahaanAsuransiById(id);
  if (!prefill) return notFound();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Edit Perusahaan Asuransi</h1>
      <UpdatePerusahaanAsuransiForm id={id} defaultValues={prefill} />
    </div>
  );
}