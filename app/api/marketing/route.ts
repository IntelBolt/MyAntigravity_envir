import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // 1. Общие метрики маркетинга за СЕГОДНЯ
        const metricsRes = await query(`
            SELECT 
                SUM(sessions) as total_sessions,
                SUM(conversions) as total_conversions,
                AVG(session_duration) as avg_duration,
                SUM(event_count) as total_events
            FROM marketing_data
            WHERE date = CURRENT_DATE
        `);

        const metrics = metricsRes.rows[0] || { total_sessions: 0, total_conversions: 0, avg_duration: 0, total_events: 0 };
        const convRate = metrics.total_sessions > 0 ? (metrics.total_conversions / metrics.total_sessions) * 100 : 0;

        // 2. Тренд за последние 7 дней (включая сегодня)
        const dailyTrendRes = await query(`
            SELECT 
                date,
                SUM(sessions) as sessions,
                SUM(conversions) as conversions
            FROM marketing_data
            WHERE date >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY date
            ORDER BY date ASC
        `);

        // 3. Топ источников (для круговой диаграммы)
        const topSourcesRes = await query(`
            SELECT 
                source as name,
                SUM(sessions) as value
            FROM marketing_data
            GROUP BY source
            ORDER BY value DESC
            LIMIT 5
        `);

        // 4. Популярные страницы (Page Path)
        const topPagesRes = await query(`
            SELECT 
                page_path as name,
                SUM(sessions) as value
            FROM marketing_data
            WHERE page_path IS NOT NULL AND page_path != ''
            GROUP BY page_path
            ORDER BY value DESC
            LIMIT 5
        `);

        return NextResponse.json({
            stats: [
                { title: "Total Sessions", value: parseInt(metrics.total_sessions).toLocaleString(), change: "+8.4%", trend: "up" },
                { title: "Conversions", value: parseInt(metrics.total_conversions).toLocaleString(), change: "+12.1%", trend: "up" },
                { title: "Conv. Rate", value: `${convRate.toFixed(2)}%`, change: "+2.3%", trend: "up" },
                { title: "Avg. Duration", value: `${Math.round(metrics.avg_duration || 0)}s`, change: "-1.5%", trend: "down" }
            ],
            dailyTrend: dailyTrendRes.rows.map(r => ({
                name: new Date(r.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
                sessions: parseInt(r.sessions),
                conversions: parseInt(r.conversions)
            })),
            topSources: topSourcesRes.rows,
            topPages: topPagesRes.rows
        });

    } catch (error: any) {
        console.error('Marketing API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
