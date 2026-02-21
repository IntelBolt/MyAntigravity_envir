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
    FULL JOIN leads_data l ON ((m.google_client_id = l.google_client_id)));
-- Removed WHERE filter for client_name = 'Тест' to include all data
