import { Card, CardContent } from "@/components/card";
import { defaultPerusahaanImage } from "@/lib/globalFiles";
import { PerusahaanCardType } from "@/lib/perusahaan_asuransi/types/perusahaan-card-data";
import { Building2, FileText, CheckCircle2 } from "lucide-react";
import Image from "next/image";

type Props = {
    cardData: PerusahaanCardType;
};

const DEFAULT_BANNER = defaultPerusahaanImage;

export default function PerusahaanCard({ cardData }: Props) {
    const { nama, total_polis, jumlah_polis_aktif } = cardData;

    const isActive = jumlah_polis_aktif > 0;
    const logoUrl = null; // future-proof

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md hover:border-blue-200 cursor-pointer group">
            {/* Banner */}
            <div className="relative h-28 w-full">
                <Image
                    src={DEFAULT_BANNER}
                    alt=""
                    className="h-full w-full object-cover"
                    width={300}
                    height={200}
                />

                {/* Status badge */}
                <span
                    className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium ${isActive
                            ? "bg-green-600 text-white"
                            : "bg-gray-600 text-white"
                        }`}
                >
                    {isActive ? "Active" : "Inactive"}
                </span>

                {/* Floating logo */}
                <div className="absolute -bottom-5 left-4 h-10 w-10 rounded-md bg-white shadow flex items-center justify-center border">
                    {logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt={nama}
                            className="h-full w-full object-contain"
                            width={40}
                            height={40}
                        />
                    ) : (
                        <Building2 className="h-5 w-5 text-blue-600" />
                    )}
                </div>
            </div>

            {/* Content */}
            <CardContent className="pt-7">
                <div className="space-y-1">
                    <h3
                        className="text-sm font-semibold text-gray-900 line-clamp-1"
                        title={nama}
                    >
                        {nama}
                    </h3>
                    <p className="text-xs text-gray-500">
                        Perusahaan Asuransi
                    </p>
                </div>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border bg-gray-50 p-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FileText className="h-3.5 w-3.5" />
                            Total Polis
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                            {total_polis}
                        </div>
                    </div>

                    <div className="rounded-lg border bg-gray-50 p-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Aktif
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                            {jumlah_polis_aktif}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
