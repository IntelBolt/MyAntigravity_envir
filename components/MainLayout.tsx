"use client"

import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { AIChat } from "@/components/AIChat"

export function MainLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
            <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

            <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 custom-scrollbar relative">
                {children}
            </main>

            <div className="relative z-50 h-full flex-shrink-0">
                <AIChat />
            </div>
        </div>
    )
}
