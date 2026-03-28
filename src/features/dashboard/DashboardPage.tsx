import getCurrentUser from "@/features/dashboard/actions/getCurrentUser";
import StatCard from "@/app/dashboard/StatCard";
import { RecentPolicies } from "@/app/dashboard/RecentPolicies";
import { FileText, Users, DollarSign, ShieldAlert, PlusIcon } from 'lucide-react';
import { Button } from "@/components/button";
import getDashboardCardStats from "./actions/getDashboardCardStats";

export default async function DashboardPage() {
    const response = await getCurrentUser();
    const cardData = await getDashboardCardStats();

    if (!response.success) throw new Error(response.message);

    console.log("cardData: ", cardData);
    if(!cardData.success || !cardData.data) throw new Error(cardData.message || "Failed to fetch dashboard stats");

    // Mock data for dashboard stats - in a real app, this would come from your backend.
    const {
        total_polis_aktif,
        total_polis_tidak_aktif,
        total_premi_bulan_ini,
        total_premi_tahun_ini,
        total_nasabah_baru_bulan_ini
    } = cardData.data;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Button>
                        <span>Tambah Nasabah</span>
                        <PlusIcon className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Active Policies"
                        value={total_polis_aktif.toString()}
                        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                        description="Total active insurance policies"
                    />
                    <StatCard
                        title="Total Premium (YTD)"
                        value={`$${total_premi_tahun_ini.toLocaleString()}`}
                        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                        description="+5.2% from last month"
                    />
                    <StatCard
                        title="Inactive Policies"
                        value={total_polis_tidak_aktif.toString()}
                        icon={<ShieldAlert className="h-4 w-4 text-muted-foreground" />}
                        description="Policies requiring attention"
                    />
                    <StatCard
                        title="New Clients (This Month)"
                        value={`+${total_nasabah_baru_bulan_ini}`}
                        icon={<Users className="h-4 w-4 text-muted-foreground" />}
                        description="New clients acquired this month"
                    />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4"><RecentPolicies /></div>
                    {/* A chart component would go here */}
                    <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow flex items-center justify-center"><p className="text-muted-foreground">Claims Overview Chart</p></div>
                </div>
            </div>
        </div>
    );
}