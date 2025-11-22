'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import DatePresetButtons from './DatePresetButtons';
import { Button } from './ui/button';

export default function DateFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const date_from = searchParams.get('date_from') ?? '';
    const date_to = searchParams.get('date_to') ?? '';

    const createQueryString = useCallback(
        (paramsToUpdate: Record<string, string | undefined>) => {
            const params = new URLSearchParams(searchParams.toString());
            for (const [name, value] of Object.entries(paramsToUpdate)) {
                if (value) {
                    params.set(name, value);
                } else {
                    params.delete(name);
                }
            }
            // Reset to first page when filters change
            params.set('page', '1');

            return params.toString();
        },
        [searchParams]
    );

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newParams = {
            date_from: name === 'date_from' ? value : date_from,
            date_to: name === 'date_to' ? value : date_to,
        };
        router.push(`${pathname}?${createQueryString(newParams)}`);
    };

    const handlePresetSelect = (days: number) => {
        const today = new Date();
        const fromDate = new Date();
        fromDate.setDate(today.getDate() - days);

        const newParams = {
            date_to: today.toISOString().split('T')[0], // YYYY-MM-DD
            date_from: fromDate.toISOString().split('T')[0], // YYYY-MM-DD
        };

        router.push(`${pathname}?${createQueryString(newParams)}`);
    };

    const handleClear = () => {
        const newParams = {
            date_from: undefined,
            date_to: undefined,
        };
        router.push(`${pathname}?${createQueryString(newParams)}`);
    };

    return (
        <div className="flex items-end gap-4 my-4">
            <div className="flex flex-col">
                <label htmlFor="date_from" className="text-sm">From:</label>
                <input
                    id="date_from"
                    name="date_from"
                    type="date"
                    value={date_from}
                    onChange={handleDateChange}
                    className="border rounded px-2 py-1 text-sm" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="date_to" className="text-sm">To:</label>
                <input
                    id="date_to"
                    name="date_to"
                    type="date"
                    value={date_to}
                    onChange={handleDateChange}
                    className="border rounded px-2 py-1 text-sm" />
            </div>
            <Button
                type='button'
                onClick={handleClear}
                className='bg-white border border-grey-400 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white'
            >
                All
            </Button>
            <DatePresetButtons
                onPresetSelect={handlePresetSelect}
            />
        </div>
    );
}
