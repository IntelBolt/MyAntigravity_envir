
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: 5434,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: false,
});

async function run() {
    try {
        const client = await pool.connect();

        console.log('Dropping existing views...');
        await client.query('DROP VIEW IF EXISTS view_ai_summary CASCADE');
        await client.query('DROP VIEW IF EXISTS view_weekly_performance CASCADE');
        await client.query('DROP VIEW IF EXISTS final_analytics_report CASCADE');
        await client.query('DROP VIEW IF EXISTS view_full_identity_report CASCADE');
        await client.query('DROP VIEW IF EXISTS view_managers_performance CASCADE');

        console.log('1. Creating final_analytics_report...');
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
                l.google_client_id,
                COALESCE(l.client_id, m.client_id) AS client_id
            FROM (marketing_data m
                FULL JOIN leads_data l ON ((m.google_client_id = l.google_client_id)))
        `);

        console.log('2. Creating view_full_identity_report...');
        await client.query(`
            CREATE OR REPLACE VIEW view_full_identity_report AS
            SELECT COALESCE(l.google_client_id, m.google_client_id) AS google_client_id,
                l.lead_id,
                l.name AS lead_name,
                l.amount,
                l.status_id,
                m.date AS visit_date,
                m.source,
                m.medium,
                m.campaign,
                m.sessions,
                m.conversions AS goal_events,
                COALESCE(l.client_id, m.client_id) AS client_id
            FROM (leads_data l
                 FULL JOIN marketing_data m ON ((l.google_client_id = m.google_client_id)))
            WHERE ((l.google_client_id IS NOT NULL) OR (m.google_client_id IS NOT NULL))
        `);

        console.log('3. Creating view_managers_performance...');
        await client.query(`
            CREATE OR REPLACE VIEW view_managers_performance AS
            SELECT m.manager_name,
                count(l.lead_id) AS total_leads_in_work,
                sum(l.amount) AS total_revenue_potential,
                count(CASE WHEN (l.status_id = 142) THEN 1 ELSE NULL END) AS deals_won,
                sum(CASE WHEN (l.status_id = 142) THEN l.amount ELSE 0 END) AS actual_revenue,
                m.client_id
            FROM (managers_data m
                 LEFT JOIN leads_data l ON ((m.manager_id = l.responsible_id)))     
            GROUP BY m.manager_name, m.client_id
        `);

        console.log('4. Creating view_weekly_performance...');
        await client.query(`
            CREATE OR REPLACE VIEW view_weekly_performance AS
            WITH weekly_stats AS (
                SELECT 
                    date_trunc('week', report_date)::date as week_start,
                    client_id,
                    SUM(sessions) as sessions,
                    COUNT(DISTINCT google_client_id) as users,
                    COUNT(CASE WHEN status_id = 142 THEN 1 END) as deals_won,
                    SUM(CASE WHEN status_id = 142 THEN revenue ELSE 0 END) as revenue_won,
                    COUNT(lead_name) as total_leads,
                    SUM(revenue) as total_potential_revenue
                FROM final_analytics_report
                GROUP BY 1, 2
            ),
            comparison AS (
                SELECT 
                    *,
                    LAG(sessions) OVER (PARTITION BY client_id ORDER BY week_start) as prev_sessions,
                    LAG(revenue_won) OVER (PARTITION BY client_id ORDER BY week_start) as prev_revenue,
                    LAG(deals_won) OVER (PARTITION BY client_id ORDER BY week_start) as prev_deals
                FROM weekly_stats
            )
            SELECT 
                week_start,
                client_id,
                sessions,
                COALESCE(prev_sessions, 0) as prev_sessions,
                ROUND(CASE WHEN prev_sessions > 0 THEN ((sessions - prev_sessions)::numeric / prev_sessions * 100) ELSE 0 END, 2) as sessions_change_pct,
                revenue_won,
                COALESCE(prev_revenue, 0) as prev_revenue,
                ROUND(CASE WHEN prev_revenue > 0 THEN ((revenue_won - prev_revenue)::numeric / prev_revenue * 100) ELSE 0 END, 2) as revenue_change_pct,
                deals_won,
                COALESCE(prev_deals, 0) as prev_deals,
                ROUND(CASE WHEN prev_deals > 0 THEN ((deals_won - prev_deals)::numeric / prev_deals * 100) ELSE 0 END, 2) as deals_change_pct,
                total_leads,
                total_potential_revenue
            FROM comparison
        `);

        console.log('5. Creating view_ai_summary...');
        await client.query(`
            CREATE OR REPLACE VIEW view_ai_summary AS
            SELECT 
                'Weekly Performance'::text as metric_group,
                week_start::text as period,
                client_id,
                sessions,
                sessions_change_pct as sess_change,
                revenue_won as revenue,
                revenue_change_pct as rev_change,
                deals_won as deals,
                deals_change_pct as deal_change
            FROM view_weekly_performance
            ORDER BY week_start DESC
        `);

        console.log('Done.');
        client.release();
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

run();
