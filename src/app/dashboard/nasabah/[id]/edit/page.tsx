import { fetchNasabahById } from '@/features/nasabah/actions';
import EditNasabahForm from '@/features/nasabah/update-form';
import { notFound } from 'next/navigation';

type Params = { id: string };

export default async function EditPage({ params }: { params: Params }) {
  const { id } = await params;
  const detail = await fetchNasabahById(id);
  if (!detail) return notFound();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Edit Nasabah</h1>
      <EditNasabahForm id={id} defaultValues={detail} />
    </div>
  );
}
