"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface ChartDataItem {
    date: string;
    sessions: number;
    won_revenue: number;
}

export function PerformanceChart({ data }: { data: ChartDataItem[] }) {
    // If data is empty, use default mock or return null
    const displayData = data && data.length > 0 ? data.map(d => ({
        name: d.date ? new Date(d.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) : '',
        won: d.won_revenue,
        sessions: d.sessions
    })) : []

    return (
        <div className="w-full h-96 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/15 transition-colors duration-700" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">Revenue & Traffic Trend</h3>
                    <p className="text-xs text-zinc-500 mt-1">Comparing revenue from won deals with marketing sessions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                        <span className="text-[10px] font-bold text-zinc-300 uppercase">Revenue</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] font-bold text-zinc-300 uppercase">Sessions</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.5} />
                        <XAxis
                            dataKey="name"
                            stroke="#52525b"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#52525b"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#09090b",
                                border: "1px solid #27272a",
                                borderRadius: "12px",
                                fontSize: "12px",
                                color: "#fafafa",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                            }}
                            itemStyle={{ padding: "2px 0" }}
                            cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="won"
                            stroke="#6366f1"
                            fillOpacity={1}
                            fill="url(#colorWon)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#09090b" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="sessions"
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#colorSessions)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
