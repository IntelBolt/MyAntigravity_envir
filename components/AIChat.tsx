"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
    role: "agent" | "user"
    text: string
    time: string
    loading?: boolean
}

export function AIChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "agent",
            text: "Привет! Я твой AI-аналитик. Готов помочь с данными из AmoCRM и GA4. Что хочешь узнать?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Авто-скролл вниз при новых сообщениях
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
        }
    }, [messages, isLoading])

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userText = input;
        const userMessage: Message = {
            role: "user",
            text: userText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const webhookUrl = "/api/chat"

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: userText,
                    chatId: "dashboard_session_1"
                })
            })

            if (!response.ok) throw new Error("Ошибка связи с n8n")

            const data = await response.json()

            const agentText = Array.isArray(data)
                ? (data[0]?.output || data[0]?.text || JSON.stringify(data[0]))
                : (data.output || data.text || JSON.stringify(data))

            const agentMessage: Message = {
                role: "agent",
                text: agentText || "Не удалось получить текстовый ответ от агента.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }

            setMessages(prev => [...prev, agentMessage])
        } catch (error) {
            console.error("Chat Error:", error)
            setMessages(prev => [...prev, {
                role: "agent",
                text: "❌ Произошла ошибка при обращении к агенту. Проверь настройки вебхука.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <aside className="w-80 bg-zinc-950/40 backdrop-blur-xl border-l border-zinc-800 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center space-x-3 bg-zinc-900/20 shrink-0">
                <div className="relative">
                    <Avatar className="w-10 h-10 border border-indigo-500/30 ring-2 ring-indigo-500/10">
                        <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">IB</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
                <div>
                    <div className="font-bold text-sm text-zinc-100 uppercase tracking-wider">IntelBolt Agent</div>
                    <div className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Online (Gemini 2.5 Flash)
                    </div>
                </div>
            </div>

            <div
                className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar space-y-6"
                ref={scrollContainerRef}
            >
                {messages.map((m, i) => (
                    <div key={i} className={cn(
                        "flex flex-col max-w-[90%] animate-in fade-in slide-in-from-bottom-2 duration-500",
                        m.role === "user" ? "ml-auto items-end" : "items-start"
                    )}>
                        <div className={cn(
                            "p-3 rounded-2xl text-[13px] leading-relaxed transition-all shadow-lg whitespace-pre-wrap",
                            m.role === "agent"
                                ? "bg-zinc-800/80 text-zinc-200 rounded-tl-none border border-zinc-700/50"
                                : "bg-indigo-600/40 text-indigo-50 rounded-tr-none border border-indigo-500/30"
                        )}>
                            {m.text}
                        </div>
                        <span className="text-[9px] text-zinc-600 mt-1.5 px-1 font-mono">{m.time}</span>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex flex-col items-start max-w-[90%] animate-pulse">
                        <div className="bg-zinc-800/60 p-3 rounded-2xl rounded-tl-none border border-zinc-700/50 flex space-x-2">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md shrink-0">
                <div className="flex items-center space-x-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Спроси об аналитике..."
                        className="bg-zinc-900/50 border-zinc-800 focus:ring-1 focus:ring-indigo-500/50 text-sm h-11 rounded-xl"
                        disabled={isLoading}
                    />
                    <Button
                        size="icon"
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 h-11 w-11 transition-all rounded-xl shadow-lg shadow-indigo-500/10 active:scale-95"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
                <p className="text-[9px] text-zinc-600 mt-3 text-center uppercase tracking-tighter opacity-50">
                    AI Insights powered by n8n & Gemini
                </p>
            </div>
        </aside>
    )
}
