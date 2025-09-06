// features/perusahaan/search.tsx
type Props = {
  q: string;
  sort: "created_desc" | "created_asc" | "name_asc" | "name_desc" | "email_asc" | "email_desc";
  title?: string;
  placeholder?: string;
};

export default function Search({
  q,
  sort,
  title = "Perusahaan Asuransi",
  placeholder = "Cari nama / email / kontak / alamat",
}: Props) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-2xl font-semibold">{title}</h1>

      {/* Simple GET form: keeps SSR deterministic and URLs shareable */}
      <form className="flex items-center gap-2" method="GET">
        {/* Always reset to first page when searching */}
        <input type="hidden" name="page" value="1" />
        {/* Preserve current sort choice */}
        <input type="hidden" name="sort" value={sort} />

        <label htmlFor="q" className="sr-only">
          Cari
        </label>
        <input
          id="q"
          type="text"
          name="q"
          defaultValue={q}
          placeholder={placeholder}
          className="h-9 w-72 rounded border px-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />

        <button
          type="submit"
          className="h-9 rounded border px-3 text-sm hover:bg-gray-50"
          title="Cari"
        >
          Search
        </button>

        {/* Optional clear that preserves sort and resets page */}
        <a
          href={`?sort=${encodeURIComponent(sort)}&page=1`}
          className="h-9 rounded border px-3 text-sm hover:bg-gray-50"
          title="Hapus pencarian"
        >
          Clear
        </a>
      </form>
    </div>
  );
}
