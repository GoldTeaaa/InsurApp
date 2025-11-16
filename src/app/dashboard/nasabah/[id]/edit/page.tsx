import getNasabahDetails from '@/features/nasabah/actions/getNasabahDetails';
import NasabahForm from '@/features/nasabah/form/NasabahForm';
import { type NasabahForm as NasabahFormType } from '@/lib/nasabah/type';
import { notFound } from 'next/navigation';

type Params = { 
  id: string 
};

export default async function EditPage({ params }: { params: Params }) {
  const { id } = await params;
  const detail = await getNasabahDetails({id});

  if (!detail.success) notFound();

  return (
    <div className="p-4">
      <NasabahForm 
        mode='update'
        id={id}
        // THE IS TYPECASTED 
        initialData={detail.data as NasabahFormType}
      />
    </div>
  );
}
