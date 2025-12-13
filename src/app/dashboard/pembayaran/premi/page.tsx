import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import getPembayaranTableData from "@/features/pembayaran/pembayaranPremi/actions/getPembayaranTable";
import PembayaranTable from "@/features/pembayaran/pembayaranPremi/PremiPembayaranTable";
import StatusFilters from "@/features/pembayaran/pembayaranPremi/StatusFilters";
import NormalizeSearchParams from "@/lib/normalizeSearchParams";
import { PembayaranTableRow } from "@/lib/pembayaran/pembayaran_premi/types";
import { RawSearchParams, SearchParamsSchema } from "@/lib/types";

export default async function Page({ searchParams }: {
    searchParams: Promise<RawSearchParams>
}) {
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
    const status = params?.status ?? undefined; // Default to undefined, empty string will override the params

    const data = await getPembayaranTableData({ search, page, size, status })
    if (!data.success) {
        throw new Error(data.message)
    }
    const tableData = data.data ? data.data as PembayaranTableRow[] : []
    const totalCount = tableData.length > 0 ? Math.ceil(tableData[0].total_count / size) : 0

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Pembayaran Premi</h1>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="w-full md:w-1/2">
                    <Search
                        placeholder="Cari nomor-polis / nama / asuransi"
                        search={search}
                    />
                </div>
                <StatusFilters />
            </div>
            <PembayaranTable
                data={tableData}
            />
            <Pagination
                page={page}
                pageCount={totalCount}
            />
        </div>
    );
}