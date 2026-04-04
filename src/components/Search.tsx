'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/lib/utils/useDebounce';
import { SearchIcon } from 'lucide-react';

type Props = {
    placeholder?: string;
    search: string;
};

export default function Search({ 
    placeholder, 
    search 
}: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [searchTerm, setSearchTerm] = useState(search);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (debouncedSearchTerm === search) {
            return;
        }

        const params = new URLSearchParams(searchParams);
        params.set('page', '1'); // Reset to page 1 on new search
        if (debouncedSearchTerm) {
            params.set('search', debouncedSearchTerm);
        } else {
            params.delete('search');
        }
        replace(`${pathname}?${params.toString()}`);
    }, [debouncedSearchTerm, search, pathname, replace, searchParams]);

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                id="search"
                className="peer block w-full rounded-md border border-gray-300 py-[9px] pl-10 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder={placeholder}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm ? searchTerm : ''}
            />
            <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
    );
}