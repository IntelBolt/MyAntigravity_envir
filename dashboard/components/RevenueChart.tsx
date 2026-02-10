"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
    { name: "Jan 12", revenue: 4000 },
    { name: "Jan 13", revenue: 3000 },
    { name: "Jan 14", revenue: 5000 },
    { name: "Jan 15", revenue: 2780 },
    { name: "Jan 16", revenue: 1890 },
    { name: "Jan 17", revenue: 2390 },
    { name: "Jan 18", revenue: 3490 },
    { name: "Jan 19", revenue: 4000 },
]

export function RevenueChart() {
    return (
        <div className="w-full h-80 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-zinc-100">Revenue Over Time</h3>
                <div className="text-xs text-zinc-500 font-medium bg-zinc-800/50 px-2 py-1 rounded">Daily Update</div>
            </div>
            <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#18181b",
                                border: "1px solid #27272a",
                                borderRadius: "8px",
                                fontSize: "12px",
                                color: "#fafafa"
                            }}
                            itemStyle={{ color: "#818cf8" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#6366f1"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
