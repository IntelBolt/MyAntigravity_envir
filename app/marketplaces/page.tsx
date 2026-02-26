"use client"

import { useEffect, useState } from "react"
import { KPICard } from "@/components/KPICard"
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LineChart, Line, PieChart, Pie } from "recharts"
import { ShoppingBag, TrendingUp, Package, LayoutGrid, Loader2, Globe, ArrowUpRight, Clock, Filter, Check } from "lucide-react"
import { DashboardHeader } from "@/components/DashboardHeader"

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function MarketplacesPage() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [selectedPlatform, setSelectedPlatform] = useState("all")
    const [filterOpen, setFilterOpen] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const url = `/api/marketplaces?platform=${selectedPlatform}`
                const response = await fetch(url)
                if (!response.ok) throw new Error('Failed to fetch marketplace stats')
                const result = await response.json()
                setData(result)
            } catch (err: any) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [selectedPlatform])

    if (loading && !data) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <DashboardHeader
                    title="Marketplaces Dashboard"
                    subtitle="Аналитика по всем подключенным торговым площадкам (Ozon, WB, Kaspi, Shopify)."
                    tag="Multi-Channel"
                    tagColor="indigo"
                />

                {/* Platform Filter */}
                <div className="relative">
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white hover:border-zinc-600 transition-all text-sm font-medium shadow-lg"
                    >
                        <Filter className="w-4 h-4" />
                        {selectedPlatform === 'all' ? 'All Platforms' : selectedPlatform.toUpperCase()}
                    </button>

                    {filterOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
                            <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => { setSelectedPlatform('all'); setFilterOpen(false); }}
                                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-zinc-400 hover:bg-indigo-600/10 hover:text-indigo-400 transition-colors"
                                >
                                    <span>All Platforms</span>
                                    {selectedPlatform === 'all' && <Check className="w-4 h-4" />}
                                </button>
                                {data?.availablePlatforms?.map((p: string) => (
                                    <button
                                        key={p}
                                        onClick={() => { setSelectedPlatform(p); setFilterOpen(false); }}
                                        className="w-full flex items-center justify-between px-4 py-2 text-sm text-zinc-400 hover:bg-indigo-600/10 hover:text-indigo-400 transition-colors capitalize"
                                    >
                                        <span>{p}</span>
                                        {selectedPlatform === p && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* KPI Grid - All in KZT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.summary.map((stat: any) => (
                    <KPICard
                        key={stat.title}
                        label={stat.title}
                        value={stat.value}
                        trend={stat.change}
                        trendType={stat.trend === 'up' ? 'up' : (stat.trend === 'down' ? 'down' : 'neutral')}
                        icon={stat.title.includes('Revenue') ? TrendingUp : (stat.title.includes('Orders') ? Package : (stat.title.includes('Shops') ? Globe : LayoutGrid))}
                    />
                ))}
            </div>

            {/* Sales Dynamics - Full Width */}
            <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-zinc-100 italic">Common Sales Trend (KZT)</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700">
                        <Clock className="w-3.5 h-3.5" />
                        Updated 30m ago
                    </div>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.salesTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }}
                                formatter={(value: any) => [`${Number(value).toLocaleString()} ₸`, 'Revenue']}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#6366f1"
                                strokeWidth={4}
                                dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Latest Orders Table - Uses Original Currency */}
            <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden relative">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-pink-400" />
                        <h3 className="text-xl font-bold text-zinc-100">Recent Marketplace Sales</h3>
                    </div>
                    <button className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group">
                        View all <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                                <th className="pb-4 font-bold">Order ID</th>
                                <th className="pb-4 font-bold">Platform</th>
                                <th className="pb-4 font-bold">Customer</th>
                                <th className="pb-4 font-bold text-right">Original Amount</th>
                                <th className="pb-4 font-bold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {data.latestOrders.map((order: any) => (
                                <tr key={order.order_id} className="group hover:bg-zinc-800/20 transition-colors">
                                    <td className="py-4 text-sm font-mono text-zinc-500 group-hover:text-zinc-300">#{order.order_id.slice(-6).toUpperCase()}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                order.source === 'shopify' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                                    (order.source === 'ozon' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-zinc-800 text-zinc-400")
                                            )}>
                                                {order.source}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-zinc-300">{order.customer_name || 'Anonymous'}</td>
                                    <td className="py-4 text-right">
                                        <span className="text-indigo-400 font-bold">
                                            {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: order.currency || 'KZT', maximumFractionDigits: 0 }).format(parseFloat(order.total_price))}
                                        </span>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                            order.status === 'paid' ? "text-emerald-400 border-emerald-900/50 bg-emerald-950/20" : "text-zinc-500 border-zinc-800 bg-zinc-900"
                                        )}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Platform Distribution - Moved to bottom */}
            <div className="p-8 bg-zinc-900/10 border border-zinc-800/50 rounded-3xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl -mr-32 -mt-32 rounded-full" />
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 w-full max-w-sm h-72 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.platformBreakdown}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="revenue"
                                    nameKey="name"
                                    stroke="none"
                                >
                                    {data.platformBreakdown.map((_entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px" }}
                                    formatter={(value: any) => [`${Number(value).toLocaleString()} ₸`, 'Revenue Share']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-4xl font-black text-white">
                                {data.platformBreakdown.length}
                            </span>
                            <span className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-bold">Marketplaces</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-zinc-100 mb-2">Platform Performance</h3>
                            <p className="text-zinc-500 text-sm">Процентное соотношение выручки по всем подключенным площадкам.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.platformBreakdown.map((entry: any, index: number) => {
                                const percentage = data.totalRevenueRaw > 0 ? ((entry.revenue / data.totalRevenueRaw) * 100).toFixed(1) : "0";
                                return (
                                    <div key={entry.name} className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex items-center gap-4 group hover:border-indigo-500/50 transition-colors">
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-bold text-zinc-200 capitalize">{entry.name}</span>
                                                <span className="text-xs font-mono text-indigo-400">{percentage}%</span>
                                            </div>
                                            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000"
                                                    style={{
                                                        backgroundColor: COLORS[index % COLORS.length],
                                                        width: `${percentage}%`
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-2 text-[10px] text-zinc-500 flex justify-between uppercase font-bold tracking-wider">
                                                <span>{entry.orders} orders</span>
                                                <span>{new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(entry.revenue)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
