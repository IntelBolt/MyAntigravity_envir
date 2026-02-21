
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5434'), // Note: .env.local has 5434
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: false,
});

async function applyChanges() {
    try {
        const client = await pool.connect();

        console.log('1. Updating final_analytics_report (removing client_name filter)...');
        await client.query(`
            CREATE OR REPLACE VIEW final_analytics_report AS
            SELECT COALESCE((l.created_at)::date, m.date) AS report_date,
                m.source,
                m.medium,
                m.campaign,
                l.utm_source,
                l.utm_medium,
                l.utm_campaign,
                m.sessions,
                m.conversions AS site_events,
                l.name AS lead_name,
                l.amount AS revenue,
                l.status_id,
                l.google_client_id
            FROM (marketing_data m
                FULL JOIN leads_data l ON ((m.google_client_id = l.google_client_id)))
            -- Removed WHERE filter for client_name = 'Тест'
        `);

        console.log('2. Updating view_ai_summary (removing LIMIT 5)...');
        // Note: The original had 'Weekly Performance'::text as metric_group, etc.
        await client.query(`
            CREATE OR REPLACE VIEW view_ai_summary AS
            SELECT 
                'Weekly Performance'::text as metric_group,
                week_start::text as period,
                sessions,
                sessions_change_pct as sess_change,
                revenue_won as revenue,
                revenue_change_pct as rev_change,
                deals_won as deals,
                deals_change_pct as deal_change
            FROM view_weekly_performance
            ORDER BY week_start DESC
            -- Removed LIMIT 5
        `);

        console.log('Done.');
        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

applyChanges();
