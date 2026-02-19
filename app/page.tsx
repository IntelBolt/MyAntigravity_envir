"use client"

"use client"

import { useEffect, useState } from "react"
import { KPICard } from "@/components/KPICard"
import { PerformanceChart } from "@/components/PerformanceChart"
import { MousePointer2, Users2, Trophy, Target, Loader2 } from "lucide-react"
import { DashboardHeader } from "@/components/DashboardHeader"

export default function DashboardPage() {
  // State for real data
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/stats')
        if (!response.ok) throw new Error('Failed to fetch stats')
        const result = await response.json()
        setData(result)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Ежедневное (в данном случае частое для актуальности) автообновление
    const interval = setInterval(fetchData, 30 * 60 * 1000) // каждые 30 минут
    return () => clearInterval(interval)
  }, [])

  if (loading && !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-zinc-400 font-medium animate-pulse">Загрузка аналитики...</p>
        </div>
      </div>
    )
  }

  // Fallback values if data is missing
  const stats = data?.stats || []
  const chartData = data?.chartData || []
  const trafficSources = data?.trafficSources || []
  const topManagers = data?.topManagers || []

  // Helper to get stat by title
  const getStat = (title: string) => stats.find((s: any) => s.title === title) || { value: '0', change: '', trend: 'neutral' }
  const wonStat = getStat("Доход (Won)")
  const trafficStat = getStat("Сессии (Трафик)")
  const leadsStat = getStat("Сделок в работе")
  const winRateStat = getStat("Win Rate")

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <DashboardHeader
        title="Overview"
        subtitle={`Привет, Андрей. Вот актуальные данные по твоему бизнесу.`}
        tag="Live Intelligence"
        tagColor="indigo"
      />

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm">
          ⚠️ Ошибка подключения к БД: {error}. Проверьте настройки VPS.
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-1000">
        <KPICard
          label="Total Won (Revenue)"
          value={wonStat.value}
          trend={wonStat.change}
          icon={Trophy}
        />
        <KPICard
          label="Marketing Traffic"
          value={trafficStat.value}
          trend={trafficStat.change}
          icon={MousePointer2}
        />
        <KPICard
          label="Win Rate"
          value={winRateStat.value}
          trend={winRateStat.change}
          icon={Target}
        />
        <KPICard
          label="Active Leads"
          value={leadsStat.value}
          trend={leadsStat.change}
          icon={Users2}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
        <PerformanceChart data={chartData} />
      </div>

      {/* Bottom Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 pb-8">
        <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl group relative overflow-hidden flex flex-col min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <MousePointer2 className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-bold text-zinc-100">Top Channels (GA4)</h3>
            </div>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {trafficSources.length > 0 ? trafficSources.map((source: any) => (
              <div key={source.source} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">{source.source}</span>
                  <span className="text-zinc-200 font-bold">{source.value} sessions</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min((source.value / 300) * 100, 100)}%` }} />
                </div>
              </div>
            )) : <p className="text-zinc-500 text-sm text-center">Нет данных по каналам</p>}
          </div>
        </div>

        <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl group relative overflow-hidden flex flex-col min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Trophy className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-zinc-100">Top Managers (CRM)</h3>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            {topManagers.length > 0 ? topManagers.map((manager: any) => (
              <div key={manager.name} className="flex items-center justify-between p-3 bg-zinc-800/30 border border-zinc-800/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                    {manager.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-200">{manager.name}</div>
                    <div className="text-[10px] text-zinc-500 uppercase">{manager.deals} won deals</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">{manager.revenue}</div>
                </div>
              </div>
            )) : <p className="text-zinc-500 text-sm text-center">Нет данных по менеджерам</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
