import ReportNavBar from "@/lib/laporan/ReportNavBar";

type LayoutProps = {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="space-y-4">
            <ReportNavBar/>
            {children}
        </div>
    );
}