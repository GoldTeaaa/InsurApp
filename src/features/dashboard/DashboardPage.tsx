import getCurrentUser from "@/features/dashboard/actions.ts/getCurrentUser";
import StatCard from "@/app/dashboard/StatCard";
import { RecentPolicies } from "@/app/dashboard/RecentPolicies";
import { FileText, Users, DollarSign, ShieldAlert, PlusIcon } from 'lucide-react';
import { Button } from "@/components/button";

export default async function DashboardPage() {
    const response = await getCurrentUser();

    if (!response.success) return <p>{response.message}</p>

    // Mock data for dashboard stats - in a real app, this would come from your backend.
    const stats = {
        activePolicies: 125,
        totalPremium: 450320,
        openClaims: 12,
        newClients: 8,
    };

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
                        value={stats.activePolicies.toString()}
                        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                        description="Total active insurance policies"
                    />
                    <StatCard
                        title="Total Premium (YTD)"
                        value={`$${stats.totalPremium.toLocaleString()}`}
                        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                        description="+5.2% from last month"
                    />
                    <StatCard
                        title="Open Claims"
                        value={stats.openClaims.toString()}
                        icon={<ShieldAlert className="h-4 w-4 text-muted-foreground" />}
                        description="Claims requiring attention"
                    />
                    <StatCard
                        title="New Clients (This Month)"
                        value={`+${stats.newClients}`}
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