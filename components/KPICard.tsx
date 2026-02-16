import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
    label: string
    value: string | number
    trend: string
    trendType?: "up" | "down"
    icon?: LucideIcon
}

export function KPICard({ label, value, trend, trendType = "up", icon: Icon }: KPICardProps) {
    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full group-hover:bg-indigo-500/10 transition-colors" />

            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{label}</div>
                    {Icon && (
                        <div className="p-2 bg-zinc-800/50 rounded-lg group-hover:scale-110 transition-transform duration-500 border border-zinc-700/50">
                            <Icon className="w-4 h-4 text-indigo-400" />
                        </div>
                    )}
                </div>

                <div className="flex items-end justify-between">
                    <div className="text-3xl font-black text-white tracking-tight">{value}</div>
                    <div className={cn(
                        "flex items-center space-x-1 px-2 py-1 rounded-full text-[11px] font-bold",
                        trendType === "up"
                            ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                            : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                    )}>
                        <span>{trend}</span>
                        {trendType === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
