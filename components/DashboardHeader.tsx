"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, ChevronDown, Link2, Check } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
    title: string;
    subtitle: string;
    tag: string;
    tagColor?: string;
    onDateChange?: (range: { from: Date; to: Date }) => void;
}

export function DashboardHeader({
    title,
    subtitle,
    tag,
    tagColor = "indigo",
}: DashboardHeaderProps) {
    const today = new Date();
    const [copied, setCopied] = useState(false)

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
        } catch (err) {
            console.error('Copy Error:', err)
        }
    }

    const dateString = format(today, "dd MMMM yyyy", { locale: ru })

    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/10 backdrop-blur-md -m-8 mb-4 p-8 border-b border-zinc-800/50 gap-4">
            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]", `bg-${tagColor}-500`)} />
                    <span className={cn("text-[10px] font-bold uppercase tracking-tighter", `text-${tagColor}-400`)}>{tag}</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white">{title}</h1>
                <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>
            </div>

            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-700">
                {/* Fixed Today Display */}
                <div className="flex items-center space-x-3 px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-300 shadow-xl">
                    <CalendarIcon className={cn("w-4 h-4", `text-${tagColor}-400`)} />
                    <span className="text-sm font-medium">{dateString}</span>
                </div>

                <div className="h-8 w-[1px] bg-zinc-800 mx-1" />

                <div className="relative">
                    <button
                        onClick={handleCopyLink}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 text-white rounded-xl shadow-lg transition-all active:scale-95 min-w-[150px] justify-center",
                            copied ? "bg-emerald-600 shadow-emerald-600/20" : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"
                        )}
                    >
                        {copied ? <Check className="w-4 h-4 animate-in zoom-in duration-300" /> : <Link2 className="w-4 h-4" />}
                        <span className="text-sm font-bold">{copied ? "Ссылка скопирована" : "Копировать ссылку"}</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
