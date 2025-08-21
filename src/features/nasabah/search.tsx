export default function Search({ q }: { q: string }) {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Nasabah</h1>
            <form className="flex items-center gap-2" method="GET">
                <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Cari nama / email / kontak"
                    className="h-9 rounded border px-3 text-sm"
                />
                <button type="submit" className="h-9 rounded border px-3 text-sm">
                    Search
                </button>
            </form>
        </div>
    )
}