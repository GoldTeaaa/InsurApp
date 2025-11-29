'use client';
import React, { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Search from "./Search";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { jenis_bisnis } from "@/lib/types";

export type Filters = {
  search: string;
  startDate: string | null; // ISO date (yyyy-mm-dd) or null
  endDate: string | null;
  jenis_bisnis: string;
  jenis_coas: ('coas' | 'non-coas')[];
};

export default function FilterBox({
  onApply,
  onClear,
}: {
  onApply?: (filters: Filters) => void;
  onClear?: () => void;
}) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultFilters: Filters = {
    search: "",
    startDate: null,
    endDate: null,
    jenis_bisnis: "",
    jenis_coas: [],
  };

  const [filters, setFilters] = useState<Filters>(() => {
    // Initialize state from URL search params
    const params = new URLSearchParams(searchParams.toString());
    return {
      search: params.get('search') || "",
      startDate: params.get('date_from') || null,
      endDate: params.get('date_to') || null,
      jenis_bisnis: params.get('jenis_bisnis') || "",
      jenis_coas: (params.get('jenis_coas')?.split(',') as ('coas' | 'non-coas')[]) || [],
    };
  });

  // Effect to update state if searchParams change from external navigation
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setFilters({
      search: params.get('search') || "",
      startDate: params.get('date_from') || null,
      endDate: params.get('date_to') || null,
      jenis_bisnis: params.get('jenis_bisnis') || "",
      jenis_coas: (params.get('jenis_coas')?.split(',').filter(Boolean) as ('coas' | 'non-coas')[]) || [],
    });
  }, [searchParams]);

  const createQueryString = useCallback((filtersToApply: Filters) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filtersToApply.search) {
      params.set('search', filtersToApply.search);
    } else {
      params.delete('search');
    }

    if (filtersToApply.startDate) {
      params.set('date_from', filtersToApply.startDate);
    } else {
      params.delete('date_from');
    }

    if (filtersToApply.endDate) {
      params.set('date_to', filtersToApply.endDate);
    } else {
      params.delete('date_to');
    }

    if (filtersToApply.jenis_bisnis) {
      params.set('jenis_bisnis', filtersToApply.jenis_bisnis);
    } else {
      params.delete('jenis_bisnis');
    }

    if (filtersToApply.jenis_coas.length > 0) {
      params.set('jenis_coas', filtersToApply.jenis_coas.join(','));
    } else {
      params.delete('jenis_coas');
    }

    return params.toString();
  }, [searchParams]);

  const handleCategoryChange = (value: string) => {
    setFilters({ ...filters, jenis_bisnis: value });
  };

  function clearAll() {
    setFilters(defaultFilters);
    router.push(pathname); // Clear URL params
    onClear?.();
  }

  function apply() {
    router.push(`${pathname}?${createQueryString(filters)}`);
    onApply?.(filters);
  }

  return (
    <div className="rounded-lg border p-6 bg-white shadow-sm">
      <div className="grid grid-cols-12 gap-4 items-end">
        {/* Search */}
        <div className="col-span-12 md:col-span-4">
          <Search
            placeholder="Search by title or description"
            search={filters.search}
          />
        </div>

        {/* Start Date */}
        <div className="col-span-6 sm:col-span-2 md:col-span-2">
          <label className="block text-sm text-muted-foreground mb-2">Start Date</label>
          <div className="relative">
            <Input
              type="date"
              value={filters.startDate ?? ""}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value || null })}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="col-span-6 sm:col-span-2 md:col-span-2">
          <label className="block text-sm text-muted-foreground mb-2">End Date</label>
          <div className="relative">
            <Input
              type="date"
              value={filters.endDate ?? ""}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value || null })}
            />
          </div>
        </div>

        {/* Category */}
        <div className="col-span-12 md:col-span-4">
          <label className="block text-sm text-muted-foreground">Jenis Bisnis</label>
          <h5 className="text-sm text-muted-foreground mb-2">Only support kendaraan for now</h5>
          <RadioGroup
            value={filters.jenis_bisnis}
            onValueChange={handleCategoryChange}
            className="grid grid-cols-2 gap-2"
          >
            {jenis_bisnis.map((bisnis) => (
              <label key={bisnis} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={bisnis}
                  id={bisnis}
                  disabled={bisnis !== 'kendaraan'}
                />
                <span className="text-sm">{bisnis}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Buttons row */}
        <div className="col-span-12 flex justify-end space-x-3 mt-4">
          <Button variant="outline" onClick={clearAll}>
            Clear All
          </Button>
          <Button onClick={apply}>Apply Filters</Button>
        </div>
      </div>
    </div>
  );
}
