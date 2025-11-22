import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import deletePerusahaanAction from '@/features/perusahaan-asuransi/actions/delete';

export function UpdatePerusahaanAsuransi({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/perusahaan-asuransi/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}


export function DeletePerusahaanAsuransi({ id }: { id: string }) {
/**
 * Renders a delete button for a nasabah. The button is a form which submits to
 * the `deleteNasabahAction` action. The `id` prop should be the ID of the
 * nasabah to be deleted.
 *
 * The button is visually hidden, but screen readers will read out the text
 * "Delete". The button is wrapped in a form to prevent the browser from
 * scrolling to the top of the page when clicked.
 */
  return (
    <form action={deletePerusahaanAction}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}