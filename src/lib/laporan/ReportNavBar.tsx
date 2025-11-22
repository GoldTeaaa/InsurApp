"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { reports } from "@/lib/laporan/laporan-options";

export default function ReportNavBar() {
  const pathname = usePathname() ?? "/";

  // derive active by startsWith for nested routes
  const activeId = reports.find((r) => pathname.startsWith(r.route))?.id;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reports</h1>
      <p className="text-sm text-muted-foreground">View detailed analytics and reports</p>

      {/* Desktop: pill segmented controls */}
      <nav
        role="tablist"
        aria-label="Reports"
        className="mt-4 hidden sm:inline-flex items-center gap-2 rounded-md bg-slate-50 p-2"
      >
        {reports.map((laporan) => {
          const Icon = laporan.icon;
          const active = activeId === laporan.id;

          return (
            <Link
              key={laporan.id}
              href={laporan.route}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full transition",
                active
                  ? "bg-white shadow-sm text-slate-900 ring-1 ring-inset ring-blue-300"
                  : "text-slate-600 hover:bg-white hover:shadow-sm"
              )}
            >
              <span
                className={cn(
                  "inline-flex p-1 rounded-md",
                  active ? "bg-blue-50" : "bg-transparent"
                )}
                aria-hidden
              >
                <Icon className={cn("h-4 w-4", active ? "text-blue-600" : "text-slate-400")} />
              </span>

              <span className="text-sm font-medium">{laporan.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile: native select */}
      <div className="sm:hidden mt-2">
        <label htmlFor="report-select" className="sr-only">
          Choose report
        </label>
        <select
          id="report-select"
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={activeId ?? ""}
          onChange={(e) => {
            const selected = reports.find((r) => r.id === e.target.value);
            if (selected) window.location.href = selected.route;
          }}
        >
          <option value="" disabled>
            Select report
          </option>
          {reports.map((laporan) => (
            <option key={laporan.id} value={laporan.id}>
              {laporan.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
