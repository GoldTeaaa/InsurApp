import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import getPembayaranKomisiTableData from "@/features/pembayaran/pembayaranKomisi/actions/getPembayaranKomisiTableData";
import KomisiPembayaranTable from "@/features/pembayaran/pembayaranKomisi/KomisiPembayaranTable";
import StatusFilters from "@/features/pembayaran/pembayaranPremi/StatusFilters";
import { komisiTableData, komisiTableRowData } from "@/lib/pembayaran/pembayaran_komisi/types";
import { TableParams } from "@/lib/types";

export default async function Page({
    searchParams,
}: { searchParams?: TableParams }) {

    const params = await searchParams;
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
            <Search
                placeholder="Cari nomor-polis / nama "
                search={search}
            />
            <StatusFilters />
            <KomisiPembayaranTable data={tableRowData} />
            <Pagination
                page={page}
                pageCount={Math.ceil(totalCount / size)}
            />
        </div>
    );
}