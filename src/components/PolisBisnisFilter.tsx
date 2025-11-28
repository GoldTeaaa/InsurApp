'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

export default function PolisBisnisFilter() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleFilter = (type: string) => {
        const params = new URLSearchParams(searchParams);
        if (type) {
            params.set('jenis_bisnis', type.toLowerCase());
        } else {
            params.delete('jenis_bisnis');
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex gap-2">
            <Button onClick={() => handleFilter('')}>
                All
            </Button>
            <Button onClick={() => handleFilter('Kendaraan')}>
                Kendaraan
            </Button>
        </div>
    );
}