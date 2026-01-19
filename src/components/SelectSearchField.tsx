import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";

type options = {
  id: string;
  value: string;
};

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: options[];
  placeholder?: string;
  className?: string;
  must?: boolean
};

export default function SelectSearchField<T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  className,
  must
}: Props<T>) {
  const { control } = useFormContext<T>();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.value.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const selected = options.find((o) => o.id === field.value) ?? null;

        return (
          <div className={`flex flex-col space-y-1 ${className ?? ""}`} ref={rootRef}>
            <label className="text-sm font-medium">{label} {must && <span className="text-red-500">*</span>}  </label>

            <div className="relative">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setOpen((s) => !s);
                    setQuery("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setOpen(true);
                    }
                  }}
                  className={`relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-10 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                    }`}
                >
                  <span className={`block truncate ${selected ? "text-gray-900" : "text-gray-500"}`}>
                    {selected ? selected.value : placeholder ?? `-- Pilih ${label} --`}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </button>
              </div>

              {open && (
                <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="relative p-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cari..."
                      className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <ul className="max-h-60 overflow-auto py-1 text-base">
                    {filtered.length === 0 && (
                      <li className="px-3 py-2 text-sm text-gray-500">Tidak ada hasil</li>
                    )}

                    {filtered.map((opt) => (
                      <li key={opt.id}>
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(opt.id); // <-- store id in form payload
                            field.onBlur();
                            setOpen(false);
                          }}
                          className={`relative flex w-full cursor-default select-none items-center py-2 pl-3 pr-9 text-left text-sm hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white focus:outline-none 
                            ${field.value === opt.id ? "bg-blue-500 text-white" : "text-gray-900"}`
                          }
                        >
                          <span className="block truncate">{opt.value}</span>
                          {field.value === opt.id && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {error && <span className="my-1 text-s text-red-600">{error.message}</span>}
          </div>
        );
      }}
    />
  );
}
