"use client"

import { useEffect, useState } from "react"
import { KPICard } from "@/components/KPICard"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { Fingerprint, Search, ShieldCheck, Zap, Loader2 } from "lucide-react"
import { DashboardHeader } from "@/components/DashboardHeader"

const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f59e0b'];

export default function IdentityPage() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const response = await fetch('/api/identity')
                if (!response.ok) throw new Error('Failed to fetch identity stats')
                const result = await response.json()
                setData(result)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <DashboardHeader
                title="Identity Reports"
                subtitle="Сопоставление визитов на сайте с лидами в CRM по Client ID."
                tag="Identity Resolution"
                tagColor="violet"
            />

            <div className="flex items-center gap-3">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Client ID..."
                        className="bg-zinc-900/60 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 w-64 transition-all"
                    />
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.stats.map((stat: any) => (
                    <KPICard
                        key={stat.title}
                        label={stat.title}
                        value={stat.value}
                        trend={stat.change}
                        trendType={stat.trend === 'up' ? 'up' : 'down'}
                        icon={stat.title.includes('Matched') ? ShieldCheck : Zap}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Table: Identity Matches */}
                <div className="lg:col-span-2 p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                        <Fingerprint className="w-6 h-6 text-violet-400" />
                        <h3 className="text-xl font-bold text-zinc-100">Identity Matches (Lead ↔ Visitor)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-zinc-500 text-[10px] uppercase tracking-wider border-b border-zinc-800">
                                    <th className="pb-4 font-bold">Client ID</th>
                                    <th className="pb-4 font-bold">Lead Name</th>
                                    <th className="pb-4 font-bold">Source</th>
                                    <th className="pb-4 font-bold">Sessions</th>
                                    <th className="pb-4 font-bold text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {data.matches.map((match: any, i: number) => (
                                    <tr key={match.lead_id + i} className="group hover:bg-zinc-800/20 transition-colors">
                                        <td className="py-4 font-mono text-[10px] text-zinc-500 truncate max-w-[120px]" title={match.client_id}>
                                            {match.client_id || '---'}
                                        </td>
                                        <td className="py-4">
                                            <span className="text-sm font-medium text-zinc-200">{match.lead_name}</span>
                                        </td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400 border border-zinc-700">
                                                {match.source || 'direct'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-center font-bold text-zinc-300 text-sm">{match.sessions || 0}</td>
                                        <td className="py-4 text-right">
                                            <span className="text-violet-400 font-bold text-sm">
                                                {match.amount ? `${Number(match.amount).toLocaleString()} ₸` : '0 ₸'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Attribution Side Chart */}
                <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl">
                    <h3 className="font-bold text-zinc-100 mb-6">Attributed Sources</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.attribution}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {data.attribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-6">
                        {data.attribution.slice(0, 5).map((attr: any, i: number) => (
                            <div key={attr.source} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span>{attr.source || 'Other'}</span>
                                </div>
                                <span className="text-zinc-200 font-bold">{attr.count} matches</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
