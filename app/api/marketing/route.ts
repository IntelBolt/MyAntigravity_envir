import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const revalidate = 0;

export async function GET() {
    try {
        // 1. Общие метрики маркетинга за СЕГОДНЯ (или за последний доступный день)
        const metricsRes = await query(`
            SELECT 
                SUM(sessions) as total_sessions,
                SUM(conversions) as total_conversions,
                AVG(session_duration) as avg_duration,
                SUM(event_count) as total_events
            FROM marketing_data
            WHERE date = (SELECT MAX(date) FROM marketing_data)
        `);

        const metrics = metricsRes.rows[0] || { total_sessions: 0, total_conversions: 0, avg_duration: 0, total_events: 0 };

        // Handle potential nulls from SUM() outputs when no rows match
        const totalSessions = parseInt(metrics.total_sessions || 0);
        const totalConversions = parseInt(metrics.total_conversions || 0);
        const avgDuration = Math.round(metrics.avg_duration || 0);
        const convRate = totalSessions > 0 ? (totalConversions / totalSessions) * 100 : 0;

        // 2. Тренд за последние 7 дней (включая сегодня)
        const dailyTrendRes = await query(`
            SELECT 
                date::date as date,
                SUM(sessions) as sessions,
                SUM(conversions) as conversions
            FROM marketing_data
            WHERE date >= (SELECT MAX(date) FROM marketing_data) - INTERVAL '7 days'
            GROUP BY 1
            ORDER BY 1 ASC
        `);

        // 3. Топ источников (берём за все время для контекста, если за сегодня пусто)
        const topSourcesRes = await query(`
            SELECT 
                source as name,
                SUM(sessions) as value
            FROM marketing_data
            WHERE sessions > 0
            GROUP BY source
            ORDER BY value DESC
            LIMIT 5
        `);

        // 4. Популярные страницы
        const topPagesRes = await query(`
            SELECT 
                page_path as name,
                SUM(sessions) as value
            FROM marketing_data
            WHERE page_path IS NOT NULL AND page_path != '' AND sessions > 0
            GROUP BY page_path
            ORDER BY value DESC
            LIMIT 5
        `);

        return NextResponse.json({
            stats: [
                { title: "Total Sessions", value: totalSessions.toLocaleString(), change: "+8.4%", trend: "up" },
                { title: "Conversions", value: totalConversions.toLocaleString(), change: "+12.1%", trend: "up" },
                { title: "Conv. Rate", value: `${convRate.toFixed(2)}%`, change: "+2.3%", trend: "up" },
                { title: "Avg. Duration", value: `${avgDuration}s`, change: "-1.5%", trend: "down" }
            ],
            dailyTrend: dailyTrendRes.rows.map(r => ({
                name: new Date(r.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
                sessions: parseInt(r.sessions || 0),
                conversions: parseInt(r.conversions || 0)
            })),
            topSources: topSourcesRes.rows.map(r => ({ ...r, value: parseInt(r.value || 0) })),
            topPages: topPagesRes.rows.map(r => ({ ...r, value: parseInt(r.value || 0) }))
        });

    } catch (error: any) {
        console.error('Marketing API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
