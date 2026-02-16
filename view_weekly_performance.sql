CREATE OR REPLACE VIEW view_weekly_performance AS
WITH weekly_stats AS (
    SELECT 
        date_trunc('week', report_date)::date as week_start,
        SUM(sessions) as sessions,
        COUNT(DISTINCT google_client_id) as users,
        COUNT(CASE WHEN status_id = 142 THEN 1 END) as deals_won,
        SUM(CASE WHEN status_id = 142 THEN revenue ELSE 0 END) as revenue_won,
        COUNT(lead_name) as total_leads,
        SUM(revenue) as total_potential_revenue
    FROM final_analytics_report
    GROUP BY 1
),
comparison AS (
    SELECT 
        *,
        LAG(sessions) OVER (ORDER BY week_start) as prev_sessions,
        LAG(revenue_won) OVER (ORDER BY week_start) as prev_revenue,
        LAG(deals_won) OVER (ORDER BY week_start) as prev_deals
    FROM weekly_stats
)
SELECT 
    week_start,
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
FROM comparison;
