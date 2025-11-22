"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/clsx";
import SideNav from "@/features/dashboard/SideNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isPinned, setIsPinned] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const isSideNavOpen = isPinned || isHovering;

    const handlePinToggle = () => {
        setIsPinned((prev) => !prev);
    };

    return (
        <div className="flex h-full">
            <div
                className={cn(
                    "fixed left-0 top-0 z-20 h-full transition-all duration-300 ease-in-out",
                    isSideNavOpen ? "w-64" : "w-16"
                )}
                onMouseEnter={() => !isPinned && setIsHovering(true)}
                onMouseLeave={() => !isPinned && setIsHovering(false)}
            >
                <SideNav
                    isOpen={isSideNavOpen}
                    isPinned={isPinned}
                    onPinToggle={handlePinToggle}
                />
            </div>
            {/* Use margin-left (ml-*) to push the main content to the right of the fixed sidebar */}
            <main className={cn("h-full flex-1 overflow-y-auto p-6 md:p-12 transition-all duration-300 ease-in-out", isPinned ? "ml-64" : "ml-16")}>
                {children}
            </main>
        </div>
    );
}