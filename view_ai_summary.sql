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
LIMIT 5;
