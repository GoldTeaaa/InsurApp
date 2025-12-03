import { ReactNode } from "react";
import { formatDate } from "@/lib/utils/formatDate";

interface ColumnConfig {
    key: string;
    header: string;
    // The formatter is now optional and can be used for more complex cases in the future
    formatter?: (value: any) => ReactNode;
}

export function excelColumnParser<T extends Record<string, any>>(columns: ColumnConfig[] | undefined) {
    if (!columns) return [];

    return columns.map((column) => ({
        header: column.header,
        accessor: (row: T) => {
            const value = row[column.key];
            // Handle specific date formatting internally
            if (column.key === 'periode_mulai' || column.key === 'periode_akhir') {
                return formatDate(value as string);
            }
            return value as ReactNode;
        },
    }));
}