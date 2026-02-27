
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

async function checkData() {
    try {
        const client = await pool.connect();
        console.log('--- Checking view_weekly_performance ---');
        const res1 = await client.query("SELECT week_start FROM view_weekly_performance ORDER BY week_start DESC LIMIT 10");
        console.table(res1.rows);

        console.log('--- Checking view_ai_summary / view_ai_summery ---');
        try {
            const res2 = await client.query("SELECT * FROM view_ai_summary ORDER BY period DESC");
            console.log('view_ai_summary exists:');
            console.table(res2.rows);
        } catch (e) {
            console.log('view_ai_summary does not exist or error:', e.message);
        }

        try {
            const res3 = await client.query("SELECT * FROM view_ai_summery ORDER BY period DESC");
            console.log('view_ai_summery exists:');
            console.table(res3.rows);
        } catch (e) {
            console.log('view_ai_summery does not exist or error:', e.message);
        }

        console.log('--- Checking final_analytics_report latest date ---');
        const res4 = await client.query("SELECT MAX(report_date) as max_date FROM final_analytics_report");
        console.log('Max report_date in final_analytics_report:', res4.rows[0].max_date);

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkData();
