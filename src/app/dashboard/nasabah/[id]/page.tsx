import TableShell from '@/components/table/TableShell';
import UniversalTable from '@/components/table/UniversalTable';
import getNasabahPolisList from '@/features/nasabah/actions/getNasabahPolisList';
import { defaultDetailPolisNasabahColumn } from '@/features/nasabah/nasabahCard/defaultDetailPolisNasabahColumn';
import { notFound } from 'next/navigation';


export default async function DefaultPage({ params }: { params: { id: string } }) {

  const { id } = await params;

  const polisOfNasabahById = await getNasabahPolisList({ id });

  if (!polisOfNasabahById.success) notFound();

  const data = polisOfNasabahById.data ?? [];

  return (
    <div>
      <TableShell
        table={
          <UniversalTable
            data={data}
            columns={defaultDetailPolisNasabahColumn}
          />
        }
      />
    </div>
  );
}
