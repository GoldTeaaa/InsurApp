'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

function rangeWindow(curr: number, last: number, size = 5) {
  const half = Math.floor(size / 2);
  let start = Math.max(1, curr - half);
  let end = Math.min(last, start + size - 1);
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

  // nothing to paginate
  if (!pageCount || pageCount <= 1) return null;

  const pages = useMemo(() => rangeWindow(page, pageCount, 5), [page, pageCount]);

  const go = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(next));
    router.push(`${pathname}?${params.toString()}`);
  };

  const item = (p: number) => (
    <button
      key={p}
      onClick={() => go(p)}
      aria-current={p === page ? 'page' : undefined}
      className={[
        'h-8 min-w-8 rounded border px-2 text-sm',
        p === page ? 'bg-gray-900 text-white' : 'bg-white hover:bg-gray-100',
      ].join(' ')}
    >
      {p}
    </button>
  );

  return (
    <div className="mt-4 flex items-center justify-between gap-3 px-2">
      <div className="text-xs text-gray-600">
        Page {page} of {pageCount}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => go(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="h-8 rounded border px-3 text-sm disabled:opacity-40"
        >
          Prev
        </button>
        {pages.map(item)}
        <button
          onClick={() => go(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount}
          className="h-8 rounded border px-3 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
