import { getPerusahaanAsuransiById } from "@/features/perusahaan-asuransi/actions/getPerusahaanForUpdate";
import InfoCard from "@/features/perusahaan-asuransi/detail-page/InfoCard";
import { notFound } from "next/navigation";

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function Page({
    params
}: PageProps) {

    const { id } = await params;

    const infoCardData = await getPerusahaanAsuransiById(id);
    console.log('id: ', id);

    if (!infoCardData.success) {
        throw new Error(infoCardData.message);
    };

    const { nama, email, alamat, kontak_1, kontak_2 } = infoCardData.data ?? notFound();

    return (
        <div className="w-full">
            <InfoCard
                id={id}
                nama={nama}
                email={email}
                alamat={alamat}
                kontak_1={kontak_1}
                kontak_2={kontak_2}
            />
        </div>
    );
}