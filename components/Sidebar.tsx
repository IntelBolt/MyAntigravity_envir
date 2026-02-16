"use client"

import { cn } from "@/lib/utils"
import { BarChart3, PieChart, Users, Fingerprint, Phone, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/" },
    { name: "Marketing (GA4)", icon: BarChart3, href: "/marketing" },
    { name: "CRM & Sales", icon: Users, href: "/sales" },
    { name: "Identity Reports", icon: Fingerprint, href: "/identity" },
    { name: "Telephony (Soon)", icon: Phone, href: "#", disabled: true },
]

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname()

    return (
        <aside className={cn(
            "bg-zinc-950/60 backdrop-blur-xl border-r border-zinc-800 flex flex-col p-4 h-full transition-all duration-300 relative",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <div className={cn(
                "mb-10 px-2 flex items-center space-x-2 transition-all duration-300",
                isCollapsed && "justify-center"
            )}>
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 shrink-0">
                    I
                </div>
                {!isCollapsed && (
                    <span className="text-xl font-bold tracking-tight text-zinc-100 animate-in fade-in duration-300">IntelBolt</span>
                )}
            </div>

            <nav className="space-y-1 flex-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.name}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                "group flex items-center p-3 rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-indigo-600/20 text-indigo-400 border-r-4 border-indigo-500"
                                    : "text-zinc-400 hover:bg-indigo-600/10 hover:text-indigo-300",
                                item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                                isCollapsed ? "justify-center" : "space-x-3"
                            )}
                            title={isCollapsed ? item.name : ""}
                        >
                            <item.icon className={cn(
                                "w-5 h-5",
                                isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-indigo-300"
                            )} />
                            {!isCollapsed && (
                                <span className="font-medium animate-in fade-in duration-300">{item.name}</span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Collapse toggle button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-20 bg-zinc-900 border border-zinc-700 rounded-full p-1 text-zinc-400 hover:text-white shadow-xl z-50 transition-transform active:scale-90"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className={cn(
                "mt-auto p-2 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold flex",
                isCollapsed ? "justify-center" : "justify-start"
            )}>
                {isCollapsed ? "©" : "© 2026 Admin Panel"}
            </div>
        </aside>
    )
}
