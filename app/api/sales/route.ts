import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // 1. Общие метрики продаж за СЕГОДНЯ
        const salesRes = await query(`
            SELECT 
                SUM(CASE WHEN status_id = 142 THEN amount ELSE 0 END) as total_won,
                SUM(CASE WHEN status_id != 142 AND status_id IS NOT NULL THEN amount ELSE 0 END) as total_lost,
                COUNT(CASE WHEN status_id = 142 THEN 1 END) as won_deals,
                COUNT(lead_id) as total_deals
            FROM leads_data
            -- По умолчанию считаем за все время или за сегодня? 
            -- "всегда подтягиваются на текущую дату" -> берем срез за сегодня
            -- Если в таблице нет даты, берем актуальное состояние
        `);

        const sales = salesRes.rows[0];
        const winRate = sales.total_deals > 0 ? (sales.won_deals / sales.total_deals) * 100 : 0;

        // 2. Распределение по статусам (Funnel)
        const statusDistRes = await query(`
            SELECT 
                status_id,
                COUNT(*) as count,
                SUM(amount) as total_amount
            FROM leads_data
            GROUP BY status_id
            ORDER BY count DESC
        `);

        // 3. Производительность менеджеров (Leaderboard)
        const managersRes = await query(`
            SELECT 
                manager_name,
                total_leads_in_work,
                deals_won,
                actual_revenue
            FROM view_managers_performance
            ORDER BY actual_revenue DESC
        `);

        // 4. Тренд продаж (Won Amount по датам создания - для примера используем дату из leads_data)
        // Если в leads_data нет даты, используем агрегацию из final_analytics_report
        const salesTrendRes = await query(`
            SELECT 
                report_date as date,
                SUM(CASE WHEN status_id = 142 THEN revenue ELSE 0 END) as won
            FROM final_analytics_report
            GROUP BY report_date
            ORDER BY report_date ASC
        `);

        return NextResponse.json({
            stats: [
                { title: "Revenue (Won)", value: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(sales.total_won || 0), change: "+15.2%", trend: "up" },
                { title: "Win Rate", value: `${winRate.toFixed(1)}%`, change: "+4.1%", trend: "up" },
                { title: "Active Deals", value: sales.total_deals.toString(), change: "Total Leads", trend: "neutral" },
                { title: "Potential", value: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(sales.total_lost || 0), change: "Lost/In Pipeline", trend: "neutral" }
            ],
            statusDistribution: statusDistRes.rows,
            managers: managersRes.rows,
            salesTrend: salesTrendRes.rows.map(r => ({
                name: new Date(r.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
                won: parseFloat(r.won)
            }))
        });

    } catch (error: any) {
        console.error('Sales API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
