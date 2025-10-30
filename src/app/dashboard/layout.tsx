"use client";

import { useState } from "react";
import SideNav from "@/features/dashboard/SideNav";

export default function DashboardLayout({children} : {children: React.ReactNode}) {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);

    return(
        <div className="relative h-screen">
            <div 
                className={`absolute left-0 top-0 z-20 h-full transition-all duration-300 ease-in-out ${isSideNavOpen ? 'w-64' : 'w-16'}`}
                onMouseEnter={() => setIsSideNavOpen(true)}
                onMouseLeave={() => setIsSideNavOpen(false)}
            >
                <SideNav isOpen={isSideNavOpen} />
            </div>
            {/* Add padding-left to the content to avoid being overlapped by the collapsed sidebar */}
            <div className="h-full overflow-y-auto p-6 pl-20 md:p-12 md:pl-24">
                {children}
            </div>
        </div>
    );
}