"use client"

import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { KPICard } from "@/components/KPICard"
import { AIChat } from "@/components/AIChat"
import { RevenueChart } from "@/components/RevenueChart"
import { Calendar, ChevronDown, Filter, Download } from "lucide-react"

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("Jan 12, 2026 - Jan 19, 2026")

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 p-8 space-y-8 custom-scrollbar">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/10 backdrop-blur-md -m-8 mb-4 p-8 border-b border-zinc-800/50 gap-4">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Live Dashboard</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Analytics Overview
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Привет, <span className="text-zinc-300 font-medium">Андрей</span>. Вот актуальные данные по твоему бизнесу.
            </p>
          </div>

          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-700">
            <button
              className="flex items-center space-x-3 px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group shadow-xl active:scale-95"
              onClick={() => alert("Выбор дат будет доступен после подключения БД")}
            >
              <Calendar className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{dateRange}</span>
              <ChevronDown className="w-4 h-4 text-zinc-600" />
            </button>
            <button className="p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-1000">
          <KPICard
            label="Total Products"
            value="12,839"
            trend="+11.2%"
          />
          <KPICard
            label="Total Sales"
            value="2,736,635"
            trend="+10.5%"
          />
          <KPICard
            label="Revenue"
            value="$32,839"
            trend="+9.8%"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <RevenueChart />
        </div>

        {/* Categories Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 pb-8">
          <div className="group relative overflow-hidden p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl h-56 flex flex-col items-center justify-center text-zinc-500 border-dashed hover:border-indigo-500/30 hover:bg-zinc-900/40 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
            </div>
            <div className="p-3 rounded-full bg-zinc-800/50 mb-4 group-hover:scale-110 transition-transform">
              <Filter className="w-6 h-6 text-zinc-600" />
            </div>
            Marketing (GA4) widget coming soon...
          </div>
          <div className="group relative overflow-hidden p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl h-56 flex flex-col items-center justify-center text-zinc-500 border-dashed hover:border-emerald-500/30 hover:bg-zinc-900/40 transition-all">
            <div className="p-3 rounded-full bg-zinc-800/50 mb-4 group-hover:scale-110 transition-transform">
              <ChevronDown className="w-6 h-6 text-zinc-600" />
            </div>
            CRM Leads widget coming soon...
          </div>
        </div>
      </main>

      {/* Right AI Sidebar */}
      <div className="relative z-50">
        <AIChat />
      </div>
    </div>
  )
}
