'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

function rangeWindow(curr: number, last: number, size = 5) {
  const half = Math.floor(size / 2);
  let start = Math.max(1, curr - half);
  const end = Math.min(last, start + size - 1);
  start = Math.max(1, Math.min(start, end - size + 1));
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function Pagination({
  page,
  pageCount,
}: {
  page: number;
  pageCount: number;
}) {
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const pageSize = Number(searchParams.get('pageSize')) || 10;
  const [pageSize, setPageSize] = useState(searchParams.get('size') || 10);
  
  const pages = useMemo(() => rangeWindow(page, pageCount), [page, pageCount]);

  // nothing to paginate (Optional, user may want to ensure that the data is only one page)
  if (!pageCount /*|| pageCount <= 1*/) return null;

  const go = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(next));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('size', e.target.value);
    params.set('page', '1'); // Reset to first page
    setPageSize(e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const item = (p: number) => (
    <button
      key={p}
      onClick={() => go(p)}
      aria-current={p === page ? 'page' : undefined}
      className="relative flex h-10 w-10 items-center justify-center rounded-md px-2 text-sm transition-colors focus:outline-none"
    >
      {/* top highlight line for active page */}
      <span
        aria-hidden
        className={[
          'absolute left-1/2 top-1 -translate-x-1/2 h-0.5 w-6 rounded-full transition-all',
          p === page ? 'bg-indigo-500' : 'bg-transparent',
        ].join(' ')}
      />
      <span
        className={[
          'z-10 select-none',
          p === page ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-gray-800',
        ].join(' ')}
      >
        {p}
      </span>
    </button>
  );

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">Rows per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 10, 25, 50].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">Page {page} of {pageCount}</div>
      </div>

      <div className="px-6 py-4">
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Prev (left) */}
            <div className="flex items-center">
              <button
                onClick={() => go(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-opacity disabled:opacity-40 focus:outline-none"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-gray-600">Previous</span>
              </button>
            </div>

            {/* Center page numbers */}
            <div className="flex justify-center">
              <nav aria-label="Pagination" className="flex items-center gap-2">
                {/* first-page + ellipsis if pages does not include 1 */}
                {pages[0] > 1 && (
                  <>
                    <button
                      onClick={() => go(1)}
                      className="flex h-10 w-10 items-center justify-center rounded-md px-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      1
                    </button>
                    <span className="px-2 text-gray-400">…</span>
                  </>
                )}

                {pages.map(item)}

                {/* last-page + ellipsis if pages does not include pageCount */}
                {pages[pages.length - 1] < pageCount && (
                  <>
                    <span className="px-2 text-gray-400">…</span>
                    <button
                      onClick={() => go(pageCount)}
                      className="flex h-10 w-10 items-center justify-center rounded-md px-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      {pageCount}
                    </button>
                  </>
                )}
              </nav>
            </div>

            {/* Next (right) */}
            <div className="flex justify-end items-center">
              <button
                onClick={() => go(Math.min(pageCount, page + 1))}
                disabled={page >= pageCount}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-opacity disabled:opacity-40 focus:outline-none"
              >
                <span className="text-gray-600">Next</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
