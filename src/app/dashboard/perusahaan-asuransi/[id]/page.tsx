import { getPerusahaanAsuransiById } from "@/features/perusahaan-asuransi/actions/getPerusahaanForUpdate";
import InfoCard from "@/features/perusahaan-asuransi/detail-page/InfoCard";
import { notFound } from "next/navigation";
import StatCard from "@/features/perusahaan-asuransi/detail-page/StatCard";
import { ArrowLeft, Building, Building2 } from "lucide-react";
import { Button } from "@/components/button";
import router from "next/navigation";
import BackButton from "@/components/BackButton";
import { getTotalPolisForPerusahaanWithId } from "@/features/perusahaan-asuransi/actions/getStatForPerusahaan";

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function Page({
    params
}: PageProps) {

    const { id } = await params;

    const infoCardData = await getPerusahaanAsuransiById(id);
    
    if (!infoCardData.success) {
        throw new Error(infoCardData.message);
    };
    
    const statData = await getTotalPolisForPerusahaanWithId(id);

    if(!statData.success) {
        throw new Error(statData.message);
    }

    const { total_polis, jumlah_polis_aktif } = statData.data ?? {undefined};
    const { nama, email, alamat, kontak_1, kontak_2 } = infoCardData.data ?? notFound();

    return (
        <div className="w-full">
            <BackButton />

            <div className="flex flex-col gap-y-4">
                <InfoCard
                    id={id}
                    nama={nama}
                    email={email}
                    alamat={alamat}
                    kontak_1={kontak_1}
                    kontak_2={kontak_2}
                />
                <div className="flex flex-col md:flex-row gap-4">
                    <StatCard
                        title="Total Polis Aktif"
                        value={jumlah_polis_aktif ?? 0}
                        icon={Building2}
                    />
                    <StatCard
                        title="Total Polis Keseluruhan"
                        value={total_polis ?? 0}
                        icon={Building}
                    />
                </div>
            </div>
        </div>
    );
}