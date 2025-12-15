"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SearchParamsProps } from "@/lib/types";
import { supabase } from "~/utils/supabase/client";

// Can't use the ActionState type because it doesn't have the data{rows and total_count} property
type FetcherResponse<T> = {
    success: boolean;
    message?: string;
    data?: {
        rows: T[];
        total_count: number;
    };
};

type UseLaporanProps<T> = {
    fetcher: (params: { searchParams: SearchParamsProps }) => Promise<FetcherResponse<T>>;
};

export function useLaporanData<T>({ fetcher }: UseLaporanProps<T>) {
    const params = useSearchParams();
    const [paginatedRowData, setPaginatedRowData] = useState<T[]>([]);
    const [exportRowData, setExportRowData] = useState<T[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const search = params?.get('search') ?? "";
    const page = Number(params?.get('page') ?? 1);
    const size = Number(params?.get('size') ?? 10);
    const startDate = params?.get('date_from') ?? "";
    const endDate = params?.get('date_to') ?? "";

    // Effect for fetching paginated data
    useEffect(() => {
        setIsLoading(true);
        fetcher({
            searchParams: { 
                search, 
                page, 
                size, 
                date_from: startDate, 
                date_to: endDate, 
                status: null 
            }
        }).then((res) => {
            if (res.success) {
                setPaginatedRowData(res.data?.rows ?? []);
                setPageCount(Math.ceil((res.data?.total_count ?? 0) / size));
            } else {
                console.error(res.message);
                setPaginatedRowData([]);
                setPageCount(0);
            }
        }).catch(error => {
            console.error("Failed to fetch laporan data:", error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [search, page, size, startDate, endDate, fetcher]);

    const prepareDataForExport = async () => {
        // Fetch all data (page 1, large size)
        const res = await fetcher({
            searchParams: { search, page: 1, size: 5000, date_from: startDate, date_to: endDate, status: null },
        });
        if (res.success) {
            setExportRowData(res.data?.rows ?? []);
            return true;
        } else {
            console.error("Failed to fetch data for export:", res.message);
            setExportRowData([]);
            return false;
        }
    };

    return { paginatedRowData, exportRowData, pageCount, isLoading, search, page, size, startDate, endDate, prepareDataForExport };
}