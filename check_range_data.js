
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: false,
});

async function checkRange() {
    try {
        const client = await pool.connect();
        const start = '2026-02-15';
        const end = '2026-02-21';

        console.log(`Checking data for period: ${start} to ${end}\n`);

        const queries = [
            { name: 'marketing_data', query: `SELECT COUNT(*) FROM marketing_data WHERE date >= '2026-02-21'` },
            { name: 'leads_data', query: `SELECT COUNT(*) FROM leads_data WHERE created_at >= '2026-02-21'` },
            { name: 'final_analytics_report', query: `SELECT COUNT(*) FROM final_analytics_report WHERE report_date >= '2026-02-21'` }
        ];

        for (const q of queries) {
            const res = await client.query(q.query);
            console.log(`${q.name} (since Feb 21): ${res.rows[0].count} records`);
        }

        if (parseInt((await client.query("SELECT COUNT(*) FROM leads_data WHERE created_at >= '2026-02-21'")).rows[0].count) > 0) {
            console.log('\nNew Leads Found:');
            const leads = await client.query("SELECT lead_id, name, created_at FROM leads_data WHERE created_at >= '2026-02-21' ORDER BY created_at DESC");
            console.table(leads.rows);
        }

        console.log('\nDetailed marketing_data by day (Feb 15-22):');
        const resMkt = await client.query(`
            SELECT date::date, COUNT(*) 
            FROM marketing_data 
            WHERE date BETWEEN '2026-02-15' AND '2026-02-22'
            GROUP BY date::date
            ORDER BY date::date DESC
        `);
        console.table(resMkt.rows);

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkRange();
