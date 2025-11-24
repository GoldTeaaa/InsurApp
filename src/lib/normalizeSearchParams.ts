import { SearchParamsProps } from "./laporan/laporan-aging-premi/types";
import { RawSearchParams } from "./types";

export default function NormalizeSearchParams(raw: RawSearchParams): SearchParamsProps {
    const handleArray = (value: string| string[] | undefined) =>  Array.isArray(value) ? value[0] : value ?? "";
    
    return {
        search: handleArray(raw.search),
        page: handleArray(raw.page),
        size: handleArray(raw.size),
        date_from: handleArray(raw.date_from),
        date_to: handleArray(raw.date_to),
    }
}