"use client";
import {
  type SVGProps,
  type ForwardRefExoticComponent,
  type RefAttributes
} from "react";
import {
  ChartBarIcon,
  CreditCardIcon,
  DocumentTextIcon,
  HomeIcon,
  UsersIcon,
  BuildingOffice2Icon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavDropdown from "./NavDropdown";
import { cn } from "@/lib/utils/clsx";
import { NavItem } from "@/lib/sideNav/types";

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/dashboard/nasabah", label: "Nasabah", icon: UsersIcon },
  { href: "/dashboard/perusahaan-asuransi", label: "Perusahaan Asuransi", icon: BuildingOffice2Icon },
  { href: "/dashboard/polis", label: "Polis", icon: DocumentTextIcon },
  {
    label: "Pembayaran",
    icon: CreditCardIcon,
    children: [
      { href: "/dashboard/pembayaran/premi", label: "Pembayaran Premi" },
      { href: "/dashboard/pembayaran/komisi", label: "Pembayaran Komisi" },
    ],
  },
  { href: "/dashboard/laporan", label: "Laporan", icon: ChartBarIcon },
];

export default function SideNav({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-dvh w-full flex-col overflow-y-auto border-r border-zinc-200 bg-white">
      <div className="flex h-14 items-center gap-2 border-b border-zinc-200 px-4">
        <div className="h-4 w-4 rounded-sm bg-blue-600" />
        {isOpen && <span className="font-semibold">InsureCo</span>}
      </div>

      <nav className="space-y-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          if (!item) return null;
          if (item.children) {
            return (
              <NavDropdown
                key={item.label}
                item={item}
                isOpen={isOpen}
                pathname={pathname}
              />
            );
          } else {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  !isOpen && "justify-center",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          }
        })}
      </nav>

      <div className="px-2 py-4">
        <button className="flex h-9 w-full items-center justify-center gap-3 rounded-md bg-blue-600 px-3 text-sm font-semibold text-white">
          <PlusIcon className="h-5 w-5 shrink-0" />
          {isOpen && <span className="truncate">New Customer</span>}
        </button>
      </div>

      <div className={cn("mt-auto p-4 text-center text-xs text-gray-500", !isOpen && "hidden")}>
        v0.1 • Internal
      </div>
    </aside>
  );
}
