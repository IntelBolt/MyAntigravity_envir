"use client"

import { Sidebar } from "@/components/Sidebar"
import { KPICard } from "@/components/KPICard"
import { AIChat } from "@/components/AIChat"
import { RevenueChart } from "@/components/RevenueChart"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-zinc-950 via-zinc-950 to-indigo-950/20 p-8 space-y-8">
        <header className="flex justify-between items-center bg-zinc-900/10 backdrop-blur-sm -m-8 mb-4 p-8 border-b border-zinc-800/50">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
              Analytics Overview
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Welcome back, Andrey. Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-zinc-400">
              Jan 12, 2026 - Jan 19, 2026
            </div>
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            label="Total Products"
            value="12,839"
            trend="+11%"
          />
          <KPICard
            label="Total Sales"
            value="2,736,635"
            trend="+10%"
          />
          <KPICard
            label="Revenue"
            value="$32,839"
            trend="+9%"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          <RevenueChart />
        </div>

        {/* Categories Section (Placeholder for additional stats) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-2xl h-48 flex items-center justify-center text-zinc-600 border-dashed">
            Marketing (GA4) widget coming soon...
          </div>
          <div className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-2xl h-48 flex items-center justify-center text-zinc-600 border-dashed">
            CRM Leads widget coming soon...
          </div>
        </div>
      </main>

      {/* Right AI Sidebar */}
      <AIChat />
    </div>
  )
}
