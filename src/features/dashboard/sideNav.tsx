// components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/nasabah", label: "Nasabah" },
  { href: "/perusahaan-asuransi", label: "Perusahaan Asuransi" },
  { href: "/polis", label: "Polis" },
  { href: "/pembayaran", label: "Pembayaran" },
  { href: "/laporan", label: "Laporan" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-dvh w-64 shrink-0 border-r border-zinc-200 bg-white">
      <div className="flex h-14 items-center gap-2 border-b border-zinc-200 px-4">
        <div className="h-4 w-4 rounded-sm bg-blue-600" />
        <span className="font-semibold">InsureCo</span>
      </div>

      <nav className="space-y-1 px-2 py-4">
        {NAV.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Optional custom buttons area */}
      <div className="px-2 py-4">
        <button className="h-9 w-full rounded-md bg-blue-600 text-sm font-semibold text-white">
          New Customer
        </button>
      </div>

      <div className="mt-auto p-4 text-xs text-gray-500">v0.1 • Internal</div>
    </aside>
  );
}
