"use client"

import { useEffect, useState } from "react"
import { KPICard } from "@/components/KPICard"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from "recharts"
import { MousePointer2, Target, BarChart3, Globe, Loader2 } from "lucide-react"
import { DashboardHeader } from "@/components/DashboardHeader"

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

export default function MarketingPage() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData(isInitial = false) {
            try {
                if (isInitial) setLoading(true)
                const response = await fetch('/api/marketing')
                if (!response.ok) throw new Error('Failed to fetch marketing stats')
                const result = await response.json()
                setData(result)
            } catch (err: any) {
                setError(err.message)
            } finally {
                if (isInitial) setLoading(false)
            }
        }
        fetchData(true)

        const interval = setInterval(() => fetchData(false), 30 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    if (loading && !data) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <DashboardHeader
                title="Marketing (GA4)"
                subtitle="Анализ трафика и эффективности рекламных каналов."
                tag="Acquisition Insights"
                tagColor="indigo"
            />

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.stats.map((stat: any) => (
                    <KPICard
                        key={stat.title}
                        label={stat.title}
                        value={stat.value}
                        trend={stat.change}
                        trendType={stat.trend === 'up' ? 'up' : 'down'}
                        icon={stat.title.includes('Conv') ? Target : MousePointer2}
                    />
                ))}
            </div>

            {/* Main Chart: Traffic Trend */}
            <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-zinc-100">Traffic & Conversion Trend</h3>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.dailyTrend}>
                            <defs>
                                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px" }} />
                            <Area type="monotone" dataKey="sessions" stroke="#6366f1" fill="url(#colorSessions)" strokeWidth={3} />
                            <Area type="monotone" dataKey="conversions" stroke="#ec4899" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Sources Pie Chart */}
                <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl">
                    <h3 className="font-bold text-zinc-100 mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-400" />
                        Sessions by Source
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.topSources}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.topSources.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {data.topSources.map((s: any, i: number) => (
                            <div key={s.name} className="flex items-center gap-2 text-xs text-zinc-400">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="truncate">{s.name}</span>
                                <span className="ml-auto text-zinc-200 font-bold">
                                    {data.stats[0].value.replace(/\D/g, '') !== '0'
                                        ? ((s.value / parseInt(data.stats[0].value.replace(/\D/g, ''))) * 100).toFixed(0)
                                        : '0'}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Pages Bar Chart */}
                <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl">
                    <h3 className="font-bold text-zinc-100 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                        Most Visited Pages
                    </h3>
                    <div className="space-y-4">
                        {data.topPages.map((page: any) => (
                            <div key={page.name} className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-400 truncate max-w-[70%]">{page.name}</span>
                                    <span className="text-zinc-200 font-bold">{page.value} views</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${(page.value / data.topPages[0].value) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
