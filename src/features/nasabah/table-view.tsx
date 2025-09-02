import { fetchNasabahPage } from '@/features/nasabah/actions';
import { type NasabahSort } from '@/lib/nasabah/types';
import Pagination from './pagination';
import { UpdateInvoice, DeleteNasabah } from './buttons';

function fmt(iso?: string | null) {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
        return iso;
    }
}

export default async function Table({ q, page, sort }: { q: string; page: number; sort: NasabahSort }) {
    const { rows, total, pageCount, pageSize } = await fetchNasabahPage({ q, page, sort });

    if (rows.length === 0) {
        return (
            <div className="mt-6 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
                Tidak ada data nasabah.
            </div>
        );
    }
    // console.log(rows);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    {/* Mobile cards */}
                    <div className="md:hidden">
                        {rows.map((r) => (
                            <div key={r.id} className="mb-2 w-full rounded-md bg-white p-4">
                                <div className="flex items-center justify-between border-b pb-3">
                                    <div>
                                        <p className="font-medium">{r.nama ?? '—'}</p>
                                        <p className="text-xs text-gray-500">{r.tipe}</p>
                                    </div>
                                    <div className="text-right text-xs text-gray-500">
                                        <p>{r.email ?? '—'}</p>
                                        <p>{r.contact_1 ?? '—'}</p>
                                    </div>
                                </div>
                                <div className="pt-3 text-sm text-gray-700">
                                    <p className="line-clamp-2">{r.alamat ?? ''}</p>
                                    <p className="mt-1 text-xs text-gray-500">Dibuat: {fmt(r.created_at)}</p>
                                </div>
                                <div className="flex justify-end pt-3">
                                    <UpdateInvoice id={r.id} />
                                    <DeleteNasabah id={r.id} />
                                </div>
                            </div>

                        ))}
                        <div className="mt-3 text-xs text-gray-500">Total: {total}</div>
                    </div>

                    {/* Desktop table */}
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="text-left text-sm font-medium">
                            <tr>
                                <th className="px-4 py-3 sm:pl-6">Nama</th>
                                <th className="px-3 py-3">Tipe</th>
                                <th className="px-3 py-3">Email</th>
                                <th className="px-3 py-3">Kontak 1</th>
                                <th className="px-3 py-3">Kontak 2</th>
                                <th className="px-3 py-3">Alamat</th>
                                <th className="px-3 py-3">Dibuat</th>
                                <th className="px-3 py-3">Diubah</th>
                                <th className="relative py-3 pl-6 pr-3"><span className="sr-only">Edit</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white text-sm">
                            {rows.map((r) => (
                                <tr key={r.id} className="border-b last:border-none">
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">{r.nama ?? '—'}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{r.tipe}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{r.email ?? '—'}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{r.contact_1 ?? '—'}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{r.contact_2 ?? '—'}</td>
                                    <td className="px-3 py-3">{r.alamat ?? '—'}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{fmt(r.created_at)}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{fmt(r.updated_at)}</td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <UpdateInvoice id={r.id} />
                                            <DeleteNasabah id={r.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="hidden md:flex items-center justify-between px-4 py-2 text-xs text-gray-500">
                        <Pagination page={page} pageCount={pageCount} />
                        <div className="mt-2 px-2 text-xs text-gray-600">Total: {total}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
