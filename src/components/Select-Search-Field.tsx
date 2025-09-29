import React, { useEffect, useMemo, useRef, useState } from "react";
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
};

export default function SelectSearchField<T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  className,
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
            <label className="text-sm font-medium">{label}</label>

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
                className={`w-full text-left rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
              >
                <span className={`${selected ? "text-gray-900" : "text-gray-500"}`}>
                  {selected ? selected.value : placeholder ?? `-- Pilih ${label} --`}
                </span>
              </button>

              {open && (
                <div className="absolute z-20 mt-1 w-full rounded-md border bg-white shadow-md">
                  <div className="p-2">
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cari..."
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>

                  <ul className="max-h-48 overflow-auto px-1 pb-2">
                    {filtered.length === 0 && (
                      <li className="px-3 py-2 text-sm text-gray-500">Tidak ada hasil</li>
                    )}

                    {filtered.map((opt) => (
                      <li key={opt.id} className="px-1">
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(opt.id); // <-- store id in form payload
                            field.onBlur();
                            setOpen(false);
                          }}
                          className={`w-full text-left rounded px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 ${
                            field.value === opt.id ? "font-semibold" : ""
                          }`}
                        >
                          {opt.value}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {error && <span className="text-sm text-red-600">{error.message}</span>}
          </div>
        );
      }}
    />
  );
}
