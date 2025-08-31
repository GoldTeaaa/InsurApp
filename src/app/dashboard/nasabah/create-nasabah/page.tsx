'use client';

import NasabahForm from "@/features/nasabah/create-form";
import { useSearchParams, useRouter } from "next/navigation";

function Page() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tipe = (searchParams.get('tipe') === 'perusahaan' ? 'perusahaan' : 'pribadi') as 'pribadi' | 'perusahaan';
    const onTipeChange = (next: 'pribadi' | 'perusahaan') => router.replace(`?tipe=${next}`, { scroll: false });

    return (
        <div>
            <NasabahForm tipe={tipe} onTipeChange={onTipeChange}/>
        </div>
    );
}

export default Page;