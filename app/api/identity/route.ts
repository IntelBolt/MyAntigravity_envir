import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const revalidate = 0;

const DEFAULT_CLIENT_ID = 10234;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const clientIdParam = searchParams.get('clientId');
    const clientId = clientIdParam ? parseInt(clientIdParam) : DEFAULT_CLIENT_ID;

    try {
        // 1. Общая статистика атрибуции конкретного клиента
        const statsRes = await query(`
            SELECT 
                COUNT(*) as total_matches,
                COUNT(DISTINCT google_client_id) as unique_visitors,
                COUNT(DISTINCT lead_id) as unique_leads
            FROM view_full_identity_report
            WHERE client_id = $1
        `, [clientId]);

        const stats = statsRes.rows[0] || { total_matches: 0, unique_visitors: 0, unique_leads: 0 };

        // 2. Детальный список сопоставлений для клиента
        const matchesRes = await query(`
            SELECT 
                google_client_id,
                lead_id,
                lead_name,
                amount,
                status_id,
                source,
                medium,
                sessions,
                goal_events
            FROM view_full_identity_report
            WHERE client_id = $1
            ORDER BY sessions DESC
            LIMIT 20
        `, [clientId]);

        // 3. Атрибуция по источникам для клиента
        const attributionRes = await query(`
            SELECT 
                source,
                COUNT(*) as count
            FROM view_full_identity_report
            WHERE client_id = $1 AND source IS NOT NULL
            GROUP BY source
            ORDER BY count DESC
        `, [clientId]);

        return NextResponse.json({
            stats: [
                { title: "Matched Leads", value: stats.unique_leads.toString(), change: "Direct Attribution", trend: "up" },
                { title: "Matched Visitors", value: stats.unique_visitors.toString(), change: "Unique visitors", trend: "up" },
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
