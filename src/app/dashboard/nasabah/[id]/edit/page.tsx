import getNasabahDetails from '@/features/nasabah/actions/getNasabahDetails';
import NasabahForm from '@/features/nasabah/form/NasabahForm';
import NasabahDetail from '@/features/nasabah/nasabahCard/NasabahDetail';
import { type NasabahFormType } from '@/lib/nasabah/type';
import { notFound } from 'next/navigation';


export default async function EditPage({ params }: {params : Promise<{id: string}>}) {
  const { id } = await params;

  const detail = await getNasabahDetails(id);

  if (!detail.success) notFound();

  return (
    <div className="p-4 space-y-4">
      <NasabahForm 
        mode='update'
        id={id}
        // THE IS TYPECASTED 
        initialData={detail.data as NasabahFormType}
      />
      <NasabahDetail 
        id={id}
      />
    </div>
  );
}
