"use client"

import { useEffect, useState } from "react"
import { KPICard } from "@/components/KPICard"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend, LineChart, Line } from "recharts"
import { Trophy, Target, TrendingUp, Users, Loader2 } from "lucide-react"
import { DashboardHeader } from "@/components/DashboardHeader"

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function SalesPage() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                if (!data) setLoading(true)
                const response = await fetch('/api/sales')
                if (!response.ok) throw new Error('Failed to fetch sales stats')
                const result = await response.json()
                setData(result)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()

        const interval = setInterval(fetchData, 30 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    if (loading && !data) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <DashboardHeader
                title="CRM & Sales"
                subtitle="Отслеживание сделок, статусов и эффективности отдела продаж."
                tag="Growth Metrics"
                tagColor="emerald"
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
                        icon={stat.title.includes('Revenue') ? Trophy : (stat.title.includes('Rate') ? TrendingUp : Target)}
                    />
                ))}
            </div>

            {/* Main Chart: Sales Funnel / Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl backdrop-blur-md">
                    <h3 className="text-xl font-bold text-zinc-100 mb-6">Revenue Trend (Won)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.salesTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px" }}
                                    formatter={(value: any) => [`${Number(value).toLocaleString()} ₸`, 'Revenue']}
                                />
                                <Line type="monotone" dataKey="won" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: "#10b981" }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl">
                    <h3 className="font-bold text-zinc-100 mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-400" />
                        Deals by Status
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.statusDistribution} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="status_id" type="category" stroke="#52525b" fontSize={10} width={80} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a" }} />
                                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]}>
                                    {data.statusDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-4 text-center italic">142 = Won, others = Pipeline</p>
                </div>
            </div>

            {/* Manager Leaderboard */}
            <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-bold text-zinc-100">Manager Performance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                                <th className="pb-4 font-bold">Manager</th>
                                <th className="pb-4 font-bold">Leads in Work</th>
                                <th className="pb-4 font-bold">Won Deals</th>
                                <th className="pb-4 font-bold text-right">Revenue (Won)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {data.managers.filter((m: any) => m.manager_name !== 'Технический Пользователь').map((manager: any) => (
                                <tr key={manager.manager_name} className="group hover:bg-zinc-800/20 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                                                {manager.manager_name[0]}
                                            </div>
                                            <span className="text-sm font-medium text-zinc-200">{manager.manager_name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-zinc-400">{manager.total_leads_in_work}</td>
                                    <td className="py-4 font-bold text-zinc-200">{manager.deals_won}</td>
                                    <td className="py-4 text-right">
                                        <span className="text-emerald-400 font-bold">
                                            {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(parseFloat(manager.actual_revenue))}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
