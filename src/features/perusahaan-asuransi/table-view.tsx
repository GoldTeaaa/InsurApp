import { PerusahaanRow } from "@/lib/perusahaan_asuransi/types";
import { UpdatePerusahaanAsuransi, DeletePerusahaanAsuransi } from "@/features/perusahaan-asuransi/buttons";

function fmt(iso?: string | null) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return String(iso);
  }
}

/** Server Component */
export default async function Table({rows, totalPage} : {rows: PerusahaanRow[]; totalPage: number}) {
  if (rows.length === 0) {
    return (
      <div className="mt-6 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
        Tidak ada data perusahaan.
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile cards */}
          <div className="md:hidden">
            {rows.map((r) => (
              <div
                key={r.id}
                className="mb-2 w-full rounded-md bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{r.nama}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>{r.email ?? "-"}</p>
                    <p>{[r.kontak_1, r.kontak_2].filter(Boolean).join(" / ") || "-"}</p>
                  </div>
                </div>

                <div className="pt-3 text-sm text-gray-700">
                  <p className="line-clamp-2">{r.alamat ?? ""}</p>
                  <p className="mt-2 text-xs text-gray-400">Dibuat: {fmt(r.created_at)}</p>
                </div>

                {/* Actions (mobile) */}
                <div className="mt-3 flex justify-end gap-2">
                  <UpdatePerusahaanAsuransi id={r.id} />
                  <DeletePerusahaanAsuransi id={r.id} />
                </div>
              </div>
            ))}
            <div className="mt-4 text-center text-xs text-gray-500">Total: {totalPage}</div>
          </div>

          {/* Desktop table */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="text-left text-sm font-normal text-gray-500">
              <tr>
                <th className="px-4 py-4 font-medium sm:pl-6">Nama</th>
                <th className="px-3 py-4 font-medium">Email</th>
                <th className="px-3 py-4 font-medium">Kontak</th>
                <th className="px-3 py-4 font-medium">Alamat</th>
                <th className="px-3 py-4 font-medium">Dibuat</th>
                <th className="px-3 py-4 font-medium">Diubah</th>
                <th className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-sm">
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 last:border-none transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 font-medium text-gray-800">{r.nama}</td>
                  <td className="whitespace-nowrap px-3 py-4">{r.email ?? "-"}</td>
                  <td className="whitespace-nowrap px-3 py-4">
                    {[r.kontak_1, r.kontak_2].filter(Boolean).join(" / ") || "-"}
                  </td>
                  <td className="max-w-xs truncate px-3 py-4">{r.alamat ?? "-"}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">{fmt(r.created_at)}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">{fmt(r.updated_at)}</td>
                  <td className="whitespace-nowrap py-4 pl-6 pr-3">
                    <div className="flex justify-end gap-2">
                      <UpdatePerusahaanAsuransi id={r.id} />
                      <DeletePerusahaanAsuransi id={r.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-2 hidden items-center justify-between border-t border-gray-200 px-4 py-3 text-xs text-gray-500 md:flex">
            {/* <Pagination page={page} pageCount={pageCount} /> */}
            <div className="px-2 text-xs text-gray-600">Total: {totalPage}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
