import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
    label: string
    value: string | number
    trend: string
    trendType?: "up" | "down"
}

export function KPICard({ label, value, trend, trendType = "up" }: KPICardProps) {
    return (
        <Card className="bg-zinc-900/40 border-zinc-800 backdrop-blur-md hover:border-zinc-700 transition-colors">
            <CardContent className="p-6">
                <div className="text-zinc-400 text-sm font-medium">{label}</div>
                <div className="flex items-end justify-between mt-2">
                    <div className="text-2xl font-bold text-zinc-100">{value}</div>
                    <div className={cn(
                        "flex items-center space-x-1 text-sm font-medium",
                        trendType === "up" ? "text-emerald-500" : "text-rose-500"
                    )}>
                        <span>{trend}</span>
                        {trendType === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
