import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import getPembayaranTableData from "@/features/pembayaran/actions/getPembayaranTable";
import PembayaranTable from "@/features/pembayaran/PembayaranTable";
import StatusFilters from "@/features/pembayaran/StatusFilters";
import { PembayaranTableRow } from "@/lib/pembayaran/pembayaran_premi/types";

export default async function Page({ searchParams }: {
    searchParams?: {
        search?: string;
        page?: string;
        size?: string;
        status?: string;
    };
}) {
    const params = await searchParams;
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
            <Search
                placeholder="Cari nomor-polis / nama / asuransi"
                search={search}
            />
            <StatusFilters />
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