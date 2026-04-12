'use client';
import Search from "@/components/Search";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import PolisJenisBisnisSelect from "./PolisJenisBisnisSelect";
import Toggle from "@/components/Toggle";
import { jenis_coas, JenisBisnis, type JenisCoasType } from "@/lib/types";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
    search: string,
    jenis_bisnis: JenisBisnis | null;
    jenis_coas: JenisCoasType | null;
    date_from: string | null;
    date_to: string | null;
}

export default function PolisFilterBox({
    search,
    jenis_bisnis,
    date_from,
    date_to,
}: Props) {
    const router = useRouter();
    // To create the searchParam
    const searchParams = useSearchParams();
    const urlSearchParams = new URLSearchParams(searchParams.toString());
    // To get the current path
    const pathName = usePathname();

    const currentFilters = {
        search : searchParams.get('search') ?? "",
        jenis_bisnis: searchParams.get('jenis_bisnis') ?? "",
        jenis_coas: searchParams.get('jenis_coas') ?? "",
        date_from: searchParams.get('date_from') ?? "",
        date_to: searchParams.get('date_to') ?? "",
    }

    const handleFilter = (key: keyof Props, value: string) => {

        if (value) {
            urlSearchParams.set(key, value);
        } else {
            urlSearchParams.delete(key);
        }

        // Concat the path with the search params
        router.push(`${pathName}?${urlSearchParams.toString()}`);
    }

    const resetFilter = () => {
        currentFilters.search = "";
        currentFilters.jenis_bisnis = "";
        currentFilters.jenis_coas = "";
        currentFilters.date_from = "";
        currentFilters.date_to = "";

        router.replace(pathName);
    }

    return (
        <div className="flex flex-col md:flex-row items-center gap-4 rounded-lg border bg-white p-4 shadow-sm w-full md:w-auto h-full">
            {/* Search Bar - 50% width */}
            <div className="w-full md:w-1/2">
                <Search
                    search={search}
                    placeholder="Cari..."
                />
            </div>

            {/* Date Picker - 25% width */}
            <div className="w-full md:w-1/5">
                <DatePickerWithRange
                    name="Tanggal Dibuat"
                    dateFrom={date_from}
                    dateTo={date_to}
                    onChangeDateFrom={(searchParams => handleFilter('date_from', searchParams))}
                    onChangeDateTo={(searchParams => handleFilter('date_to', searchParams))}
                />
            </div>

            {/* Select and Toggle - remaining 25% width */}
            <div className="flex w-full md:w-1/4 flex-row items-center gap-4">
                <div className="flex-1">
                    <PolisJenisBisnisSelect
                        value={jenis_bisnis ?? ""}
                        onChange={(searchParams => handleFilter('jenis_bisnis', searchParams))}
                    />
                </div>
                <div className="flex-shrink-0">
                    <Toggle
                        options={jenis_coas}
                        value={currentFilters.jenis_coas}
                        handleChange={(searchParams => handleFilter('jenis_coas', searchParams))}
                    />
                </div>
            </div>

            <Button
                onClick={resetFilter}
            >
                Reset Filter
            </Button>
        </div>
    )
}