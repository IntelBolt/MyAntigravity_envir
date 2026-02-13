"use client"

import { cn } from "@/lib/utils"
import { BarChart3, PieChart, Users, Fingerprint, Phone, LayoutDashboard } from "lucide-react"
import { useState } from "react"

const navItems = [
    { name: "Overview", icon: LayoutDashboard, active: true },
    { name: "Marketing (GA4)", icon: BarChart3 },
    { name: "CRM & Sales", icon: Users },
    { name: "Identity Reports", icon: Fingerprint },
    { name: "Telephony (Soon)", icon: Phone, disabled: true },
]

export function Sidebar() {
    const [activeItem, setActiveItem] = useState("Overview")

    return (
        <aside className="w-64 bg-zinc-950/60 backdrop-blur-xl border-r border-zinc-800 flex flex-col p-4 h-full">
            <div className="mb-10 px-2 flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                    I
                </div>
                <span className="text-xl font-bold tracking-tight text-zinc-100">IntelBolt</span>
            </div>

            <nav className="space-y-1 flex-1">
                {navItems.map((item) => (
                    <div
                        key={item.name}
                        onClick={() => !item.disabled && setActiveItem(item.name)}
                        className={cn(
                            "group flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                            activeItem === item.name
                                ? "bg-indigo-600/20 text-indigo-400 border-r-4 border-indigo-500"
                                : "text-zinc-400 hover:bg-indigo-600/10 hover:text-indigo-300",
                            item.disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5",
                            activeItem === item.name ? "text-indigo-400" : "text-zinc-500 group-hover:text-indigo-300"
                        )} />
                        <span className="font-medium">{item.name}</span>
                    </div>
                ))}
            </nav>

            <div className="mt-auto p-2 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                © 2026 Admin Panel
            </div>
        </aside>
    )
}
