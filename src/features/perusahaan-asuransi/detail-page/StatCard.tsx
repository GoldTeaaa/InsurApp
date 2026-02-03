import { Card } from "@/components/card";
import { LucideIcon, TrendingDown, TrendingUp, Minus } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: string;
        direction: 'up' | 'down' | 'neutral';
    };
    className?: string;
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    className = ""
}: StatCardProps) {
    return (
        <Card className={`bg-white shadow-sm border-slate-200 hover:shadow-md transition-all duration-200 ${className}`}>
            <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500">
                            {title}
                        </p>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {value}
                        </h3>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Icon className="h-5 w-5" />
                    </div>
                </div>

                {(trend || description) && (
                    <div className="mt-4 flex items-center gap-2 text-sm">
                        {trend && (
                            <div className={`flex items-center font-medium ${
                                trend.direction === 'up' ? 'text-emerald-600' : 
                                trend.direction === 'down' ? 'text-red-600' : 
                                'text-slate-600'
                            }`}>
                                {trend.direction === 'up' && <TrendingUp className="mr-1 h-4 w-4" />}
                                {trend.direction === 'down' && <TrendingDown className="mr-1 h-4 w-4" />}
                                {trend.direction === 'neutral' && <Minus className="mr-1 h-4 w-4" />}
                                {trend.value}
                            </div>
                        )}
                        {description && (
                            <p className="text-slate-500">
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}