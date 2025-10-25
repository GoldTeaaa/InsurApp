'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const statuses = [
    { label: 'Semua', value: undefined },
    { label: 'Lunas', value: 'paid' },
    { label: 'Belum Lunas', value: 'unpaid' },
    { label: 'Bayar Sebagian', value: 'partially_paid' },
];

export default function StatusFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const currentStatus = searchParams.get('status');

    const handleFilterChange = (status: string | undefined) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1'); // Reset to page 1 when filter changes
        if (status) {
            params.set('status', status);
        } else {
            params.delete('status');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2 py-4">
            {statuses.map((status) => {
                const isActive = (!currentStatus && !status.value) || currentStatus === status.value;
                return (
                    <button
                        key={status.label}
                        onClick={() => handleFilterChange(status.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors 
                            ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`
                        }
                    >
                        {status.label}
                    </button>
                );
            })}
        </div>
    );
}