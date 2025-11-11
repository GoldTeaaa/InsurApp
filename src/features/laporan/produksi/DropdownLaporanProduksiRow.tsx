import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import { Row } from "@tanstack/react-table";

type DropdownLaporanRowProps = {
    row: Row<LaporanProduksiRow>;
};

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-1.5 border-b">
        <span className="font-medium text-gray-600">{label}:</span>
        <span className="text-gray-800">{value}</span>
    </div>
);

export default function DropdownLaporanRow({ row }: DropdownLaporanRowProps) {
    const {
        premi,
        discount,
        biaya_admin_materai,
        premi_net,
        komisi,
        pph_komisi,
        komisi_net,
        no_kwitansi_komisi,
        share,
        jenis_coas,
    } = row.original;

    return (
        <div className="p-4 bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {/* Left Column: Premi Details */}
            <div className="space-y-1">
                <h4 className="font-bold text-base mb-2 border-b-2 border-slate-200 pb-1">Detail Premi</h4>
                <DetailItem label="Premi Bruto" value={premi?.toLocaleString() ?? '-'} />
                <DetailItem label="Diskon" value={discount?.toLocaleString() ?? '-'} />
                <DetailItem label="Biaya Admin & Materai" value={biaya_admin_materai?.toLocaleString() ?? '-'} />
                <DetailItem label="Premi Net" value={premi_net?.toLocaleString() ?? '-'} />
            </div>

            {/* Right Column: Komisi Details */}
            <div className="space-y-1">
                <h4 className="font-bold text-base mb-2 border-b-2 border-slate-200 pb-1">Detail Komisi</h4>
                <DetailItem label="No. Kwitansi Komisi" value={no_kwitansi_komisi || '-'} />
                <DetailItem label="Komisi Bruto" value={komisi?.toLocaleString() ?? '-'} />
                <DetailItem label="PPH Komisi" value={pph_komisi?.toLocaleString() ?? '-'} />
                <DetailItem label="Komisi Net" value={komisi_net?.toLocaleString() ?? '-'} />
            </div>
        </div>
    );
}