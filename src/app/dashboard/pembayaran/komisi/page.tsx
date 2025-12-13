import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import getPembayaranKomisiTableData from "@/features/pembayaran/pembayaranKomisi/actions/getPembayaranKomisiTableData";
import KomisiPembayaranTable from "@/features/pembayaran/pembayaranKomisi/KomisiPembayaranTable";
import StatusFilters from "@/features/pembayaran/pembayaranPremi/StatusFilters";
import NormalizeSearchParams from "@/lib/normalizeSearchParams";
import { komisiTableData, komisiTableRowData } from "@/lib/pembayaran/pembayaran_komisi/types";
import { RawSearchParams, SearchParamsSchema } from "@/lib/types";

export default async function Page({
    searchParams,
}: { searchParams : Promise<RawSearchParams> }) {

    const raw = await searchParams;
    const normalized = NormalizeSearchParams(raw);

    const parsed = SearchParamsSchema.safeParse(normalized);
    if (!parsed.success) {
        throw new Error(parsed.error.message);
    }
    const params = parsed.data;
    
    const search = params?.search ?? "";
    const page = Number(params?.page ?? 1);
    const size = Number(params?.size ?? 10);
    const status = params?.status ?? undefined;

    const data = await getPembayaranKomisiTableData({ search, page, size, status })
    if (!data.success) {
        throw new Error(data.message)
    }

    const tableData = data.data as komisiTableData;
    const tableRowData = tableData.rows as komisiTableRowData[]
    const totalCount = tableData.total_row_count

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Detail Komisi</h1>
            <div>
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <div className="w-full md:w-1/2">
                        <Search
                            placeholder="Cari nomor-polis / nama "
                            search={search}
                        />
                    </div>
                    <StatusFilters />
                </div>
                <KomisiPembayaranTable data={tableRowData} />
                <Pagination
                    page={page}
                    pageCount={Math.ceil(totalCount / size)}
                />
            </div>
        </div>
    );
}