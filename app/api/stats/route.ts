import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const revalidate = 0;

export async function GET() {
    try {
        // 1. Общая статистика по продажам из представления производительности менеджеров
        // Здесь мы берем агрегированные данные по всем менеджерам
        const salesStatsRes = await query(`
            SELECT 
                SUM(total_leads_in_work) as total_leads,
                SUM(total_revenue_potential) as total_potential,
                SUM(deals_won) as won_count,
                SUM(actual_revenue) as total_won
            FROM view_managers_performance
        `);

        const salesStats = salesStatsRes.rows[0];
        const totalWon = parseFloat(salesStats.total_won || '0');
        const totalPotential = parseFloat(salesStats.total_potential || '0');
        const wonCount = parseInt(salesStats.won_count || '0');
        const totalLeads = parseInt(salesStats.total_leads || '0');

        // Считаем Win Rate (процент выигранных сделок от общего числа завершенных или в работе)
        // Для простоты: выигранные / всего сделок
        const winRate = totalLeads > 0 ? (wonCount / totalLeads) * 100 : 0;

        // 2. Статистика по маркетингу (Sessions)
        const marketingRes = await query(`
            SELECT 
                SUM(sessions) as total_sessions
            FROM marketing_data
            WHERE date = (SELECT MAX(date) FROM marketing_data)
        `);
        const totalSessions = parseInt(marketingRes.rows[0].total_sessions || '0');

        // 3. Данные для графиков (Daily Sessions vs Revenue)
        // Группируем по дням из сводного отчета
        const chartDataRes = await query(`
            SELECT 
                report_date as date,
                SUM(CASE WHEN sessions IS NOT NULL THEN sessions ELSE 0 END) as sessions,
                SUM(CASE WHEN status_id = 142 THEN revenue ELSE 0 END) as won_revenue
            FROM final_analytics_report
            GROUP BY report_date
            ORDER BY report_date ASC
        `);

        const chartData = chartDataRes.rows.map((row: any) => ({
            name: new Date(row.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
            revenue: parseFloat(row.won_revenue || '0'),
            sessions: parseInt(row.sessions || '0')
        }));

        // 4. Топ источников трафика
        const trafficSourcesRes = await query(`
            SELECT 
                source,
                SUM(sessions) as value
            FROM marketing_data
            WHERE sessions > 0
            GROUP BY source
            ORDER BY value DESC
            LIMIT 5
        `);

        // 5. Рейтинг менеджеров
        const managersRes = await query(`
            SELECT 
                manager_name as name,
                actual_revenue as revenue,
                deals_won as deals
            FROM view_managers_performance
            WHERE actual_revenue > 0 OR total_leads_in_work > 0
            ORDER BY actual_revenue DESC
        `);

        return NextResponse.json({
            stats: [
                {
                    title: "Доход (Won)",
                    value: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(totalWon),
                    change: "+12.5% к прошлой неделе", // Пока статика
                    trend: "up"
                },
                {
                    title: "Сессии (Трафик)",
                    value: totalSessions.toLocaleString(),
                    change: "+5.2%",
                    trend: "up"
                },
                {
                    title: "Сделок в работе",
                    value: totalLeads.toString(),
                    change: "Активные лиды",
                    trend: "neutral"
                },
                {
                    title: "Win Rate",
                    value: `${winRate.toFixed(1)}%`,
                    change: "Конверсия в продажу",
                    trend: "up"
                }
            ],
            chartData,
            trafficSources: trafficSourcesRes.rows,
            topManagers: managersRes.rows.map((m: any) => ({
                ...m,
                revenue: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(parseFloat(m.revenue))
            }))
        });

    } catch (error: any) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
