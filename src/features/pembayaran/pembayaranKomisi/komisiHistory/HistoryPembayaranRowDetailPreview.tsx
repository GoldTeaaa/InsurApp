import { getStatusClass } from "@/lib/utils/getStatusBadge";
import { komisiTableRowData } from "@/lib/pembayaran/pembayaran_komisi/types";
import { PembayaranTableRow } from "@/lib/pembayaran/pembayaran_premi/types";
import { formatCurrencyIDR } from "@/lib/utils/formatCurrencyIDR";
import { convertIDR } from "@/lib/utils/convertIDR";

export type DetailField<T> = {
    label: string,
    value: (data: T) => React.ReactNode,
    className?: string
};

export const StatusBadge = ({ status }: { status: string }) => {
    const formattedStatus = status.replace(/_/g, ' ');

    return (
        <span className={getStatusClass(status)}>
            {formattedStatus}
        </span>
    );
};

const DetailItem = ({ label, value, className }: { label: string, value: React.ReactNode, className?: string }) => (
    <div className={className}>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 font-semibold">{value}</dd>
    </div>
);

type PembayaranHistoryRowDetailPreviewProps = {
    type: 'komisi' | 'premi';
    data: komisiTableRowData | PembayaranTableRow;
};

const komisiFields: DetailField<komisiTableRowData>[] = [
    { label: "Nomor Polis", value: (d) => d.nomor_polis },
    { label: "Nama Nasabah", value: (d) => d.nama_nasabah },
    { label: "Perusahaan", value: (d) => d.nama_perusahaan },
    { label: "Komisi Net", value: (d) => convertIDR(d.komisi_net) },
    { label: "Total Dibayar", value: (d) => convertIDR(d.total_paid) },
    { label: "Sisa Komisi Harus Dibayar", value: (d) => convertIDR(d.sisa_komisi) },
    {
        label: "Status",
        value: (d) => <StatusBadge status={d.status} />,
        className: "col-span-2 sm:col-span-1"
    }
];

const premiFields: DetailField<PembayaranTableRow>[] = [
    { label: "Nomor Polis", value: (d) => d.nomor_polis },
    { label: "Total Premi", value: (d) => formatCurrencyIDR(d.amount) },
    { label: "Total Sudah Dibayar", value: (d) => formatCurrencyIDR(d.total_paid) },
    {
        label: "Sisa Harus Dibayar",
        value: (d) => (
            <span className={`font-bold text-base ${d.remaining === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {d.remaining === 0 ? "Sudah Lunas" : formatCurrencyIDR(d.remaining)}
            </span>
        )
    },
    {
        label: "Status",
        value: (d) => <StatusBadge status={d.status} />
    }
];

const fieldsConfig = {
    komisi: komisiFields,
    premi: premiFields,
};


export default function PembayaranHistoryRowDetailPreview({
    data,
    type
}: PembayaranHistoryRowDetailPreviewProps
) {
    const fields = fieldsConfig[type];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border rounded-lg p-4 mb-6 bg-slate-50">
            {fields.map((field, index) => (
                <DetailItem
                    key={index}
                    label={field.label}
                    // The type of data is correctly inferred from the `type` prop, but TypeScript can't figure it out inside the map.
                    // Using `as any` here is a pragmatic choice to avoid complex type assertions.  
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value={field.value(data as any)}
                    className={field.className}
                />
            ))}
        </div>
    );
}