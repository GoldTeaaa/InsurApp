import ReportNavBar from "@/lib/laporan/ReportNavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <ReportNavBar/>
            {children}
        </div>
    );
}