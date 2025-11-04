import { komisiTableRowData } from "@/lib/pembayaran/pembayaran_komisi/types";
import { getStatusClass } from "@/lib/utils/getStatusBadge";

const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const StatusBadge = ({ status }: { status: string }) => {
    const formattedStatus = status.replace(/_/g, ' ');

    return (
        <span className={getStatusClass(status)}>
            {formattedStatus}
        </span>
    );
};

const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 font-semibold">{value}</dd>
    </div>
);

export default function HistoryRowDetailPreview({
    data
}: {
    data: komisiTableRowData
}) {
    return (
        <div className="border rounded-lg p-4 mb-6 bg-slate-50">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
                <DetailItem label="Nomor Polis" value={data.nomor_polis} />
                <DetailItem label="Nama Nasabah" value={data.nama_nasabah} />
                <DetailItem label="Perusahaan" value={data.nama_perusahaan} />
                <DetailItem label="Komisi Net" value={formatCurrency(data.komisi_net)} />
                <DetailItem label="Total Dibayar" value={formatCurrency(data.total_paid)} />
                <DetailItem label="Sisa Komisi Harus Dibayar" value={formatCurrency(data.sisa_komisi)} />
                <div className="col-span-2 sm:col-span-1">
                    <DetailItem label="Status" value={<StatusBadge status={data.status} />} />
                </div>
            </dl>
        </div>
    );
}