import { cn } from "@/lib/utils/clsx";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { NavGroup } from "@/lib/sideNav/types";

export default function NavDropdown({ item, isOpen, pathname }: {
  item: NavGroup;
  isOpen: boolean;
  pathname: string
}) {
  const [isSubmenuOpen, setSubmenuOpen] = useState(item.children.some((child) => pathname.startsWith(child.href)));
  const Icon = item.icon;
  const isActive = item.children.some((child) => pathname.startsWith(child.href));

  return (
    <div>
      <button
        onClick={() => setSubmenuOpen(!isSubmenuOpen)}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
          !isOpen && "justify-center",
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {isOpen && <span className="flex-1 truncate text-left">{item.label}</span>}
        {isOpen && (
          <ChevronDownIcon
            className={cn("h-4 w-4 shrink-0 transition-transform", isSubmenuOpen && "rotate-180")}
          />
        )}
      </button>
      {isSubmenuOpen && isOpen && (
        <div className="mt-1 space-y-1 pl-8 pr-2">
          {item.children.map((child) => {
            const active = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block truncate rounded-md px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}