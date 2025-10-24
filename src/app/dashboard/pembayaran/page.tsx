import PembayaranTable from "@/features/pembayaran/PembayaranTable";

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
    const status = params?.status ?? "";

    return (
        <div>
            <PembayaranTable
                search={search}
                page={page}
                size={size}
                status={status}
            />
        </div>
    );
}