'use client';
interface TableShellProps {
    table: React.ReactNode;
    search?: React.ReactNode;
    pagination?: React.ReactNode;
    filter?: React.ReactNode;
}

export default function TableShell({
    search,
    table,
    pagination,
    filter
}: TableShellProps) {
    return (
        <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between border-b border-gray-100">
                <div className="w-full md:max-w-sm">
                    {search}
                </div>
                {filter && (
                    <div className="flex items-center gap-2">
                        {filter}
                    </div>
                )}
            </div>
            <div className="relative w-full overflow-auto">
                {table}
            </div>
            <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                {pagination}
            </div>
        </div>
    )
}