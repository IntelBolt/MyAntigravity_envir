import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // 1. Общая статистика атрибуции
        const statsRes = await query(`
            SELECT 
                COUNT(*) as total_matches,
                COUNT(DISTINCT client_id) as unique_clients,
                COUNT(DISTINCT lead_id) as unique_leads
            FROM view_full_identity_report
        `);

        const stats = statsRes.rows[0];

        // 2. Детальный список сопоставлений (Recent identity matches)
        const matchesRes = await query(`
            SELECT 
                client_id,
                lead_id,
                lead_name,
                amount,
                status_id,
                source,
                medium,
                sessions,
                goal_events
            FROM view_full_identity_report
            ORDER BY sessions DESC
            LIMIT 20
        `);

        // 3. Атрибуция по источникам (для понимания, какие источники лучше сопоставляются)
        const attributionRes = await query(`
            SELECT 
                source,
                COUNT(*) as count
            FROM view_full_identity_report
            WHERE source IS NOT NULL
            GROUP BY source
            ORDER BY count DESC
        `);

        return NextResponse.json({
            stats: [
                { title: "Matched Leads", value: stats.unique_leads.toString(), change: "Direct Attribution", trend: "up" },
                { title: "Matched Clients", value: stats.unique_clients.toString(), change: "Unique visitors", trend: "up" },
                { title: "Total Touchpoints", value: stats.total_matches.toLocaleString(), change: "Identity joins", trend: "neutral" },
                { title: "Coverage", value: "85%", change: "Target coverage", trend: "up" }
            ],
            matches: matchesRes.rows,
            attribution: attributionRes.rows
        });

    } catch (error: any) {
        console.error('Identity API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
