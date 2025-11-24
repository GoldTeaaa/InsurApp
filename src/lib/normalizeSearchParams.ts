import { RawSearchParams, SearchParamsProps } from "./types";

export default function NormalizeSearchParams(raw: RawSearchParams): SearchParamsProps {
    const handleArray = (value: string| string[] | undefined) =>  Array.isArray(value) ? value[0] : value ?? "";
    
    return {
        search: handleArray(raw.search),
        page:  Number(handleArray(raw.page)),
        size: Number(handleArray(raw.size)),
        date_from: handleArray(raw.date_from),
        date_to: handleArray(raw.date_to),
        status: handleArray(raw.status)
    }
}