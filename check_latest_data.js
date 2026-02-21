
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
        console.log('Connected to Postgres');

        console.log('Checking MAX(report_date) in final_analytics_report...');
        const resMax = await client.query("SELECT MAX(report_date) as latest_date FROM final_analytics_report");
        console.log('Latest report_date:', resMax.rows[0].latest_date);

        console.log('\nChecking view_weekly_performance latest week...');
        const resWeekly = await client.query("SELECT week_start FROM view_weekly_performance ORDER BY week_start DESC LIMIT 5");
        console.log('Latest 5 weeks in view_weekly_performance:');
        console.table(resWeekly.rows);

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkData();
