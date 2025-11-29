'use client';
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import Search from "./Search";

export type Filters = {
  search: string;
  startDate: string | null; // ISO date (yyyy-mm-dd) or null
  endDate: string | null;
  status: string; // e.g. "all" | "open" | "closed"
  categories: string[]; // e.g. ["electronics", "books"]
};

export default function FilterBox({
  initial = undefined,
  onApply,
  onClear,
}: {
  initial?: Partial<Filters> | undefined;
  onApply?: (filters: Filters) => void;
  onClear?: () => void;
}) {
  const defaultFilters: Filters = {
    search: "",
    startDate: null,
    endDate: null,
    status: "all",
    categories: [],
  };

  const [filters, setFilters] = useState<Filters>({ ...defaultFilters, ...(initial || {}) });

  function handleCategoryChange(category: string, checked: boolean) {
    setFilters((currentFilters) => {
      const oldCategories = currentFilters.categories;
      const newCategories = checked
        ? [...oldCategories, category]
        : oldCategories.filter((c) => c !== category);
      return {
        ...currentFilters, categories: newCategories 
      };
    });
  }

  function clearAll() {
    setFilters(defaultFilters);
    onClear?.();
  }

  function apply() {
    onApply?.(filters);
  }

  return (
    <div className="rounded-lg border p-6 bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">Filters</h3>

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
            {/* <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /> */}
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
            {/* <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /> */}
          </div>
        </div>

        {/* Status */}
        <div className="col-span-12 sm:col-span-4 md:col-span-2">
          <label className="block text-sm text-muted-foreground mb-2">Status</label>
          <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="col-span-12 md:col-span-4">
          <label className="block text-sm text-muted-foreground mb-2">Category</label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-2">
              <Checkbox checked={filters.categories.includes('electronics')} onCheckedChange={(v) => handleCategoryChange('electronics', !!v)} />
              <span className="text-sm">Electronics</span>
            </label>

            <label className="flex items-center space-x-2">
              <Checkbox checked={filters.categories.includes('clothing')} onCheckedChange={(v) => handleCategoryChange('clothing', !!v)} />
              <span className="text-sm">Clothing</span>
            </label>

            <label className="flex items-center space-x-2">
              <Checkbox checked={filters.categories.includes('books')} onCheckedChange={(v) => handleCategoryChange('books', !!v)} />
              <span className="text-sm">Books</span>
            </label>

            <label className="flex items-center space-x-2">
              <Checkbox checked={filters.categories.includes('homeGoods')} onCheckedChange={(v) => handleCategoryChange('homeGoods', !!v)} />
              <span className="text-sm">Home Goods</span>
            </label>
          </div>
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
