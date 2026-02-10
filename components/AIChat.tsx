"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const messages = [
    {
        role: "agent",
        text: "Привет, Андрей! Я готов проанализировать данные по лидам из AmoCRM. С чего начнем?",
        time: "12:45"
    },
    {
        role: "user",
        text: "Покажи эффективность менеджеров за неделю.",
        time: "12:46"
    },
    {
        role: "agent",
        text: "Подгружаю view_managers_performance...",
        time: "12:46",
        loading: true
    }
]

export function AIChat() {
    return (
        <aside className="w-80 bg-zinc-950/40 backdrop-blur-xl border-l border-zinc-800 flex flex-col h-full">
            <div className="p-4 border-b border-zinc-800 flex items-center space-x-3">
                <div className="relative">
                    <Avatar className="w-10 h-10 border border-indigo-500/30">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-indigo-600 text-white">🤖</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                </div>
                <div>
                    <div className="font-bold text-sm text-zinc-100">Агент-аналитик</div>
                    <div className="text-[10px] text-emerald-500 font-medium">В сети (n8n API)</div>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={cn(
                            "flex flex-col max-w-[85%]",
                            m.role === "user" ? "ml-auto items-end" : "items-start"
                        )}>
                            <div className={cn(
                                "p-3 rounded-2xl text-sm transition-all",
                                m.role === "agent"
                                    ? "bg-zinc-800/60 text-zinc-200 rounded-tl-none border border-zinc-700/50"
                                    : "bg-indigo-600/30 text-indigo-100 rounded-tr-none border border-indigo-500/20",
                                m.loading && "italic text-zinc-400 underline cursor-pointer hover:text-zinc-300"
                            )}>
                                {m.text}
                            </div>
                            <span className="text-[10px] text-zinc-600 mt-1 px-1">{m.time}</span>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950/60">
                <div className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800 text-zinc-500 text-xs focus-within:border-indigo-500/50 transition-all cursor-text">
                    Спроси что-нибудь...
                </div>
            </div>
        </aside>
    )
}
