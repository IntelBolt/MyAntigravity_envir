
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

        const res1 = await client.query("SELECT MAX(date) as latest_marketing FROM marketing_data");
        console.log('Latest marketing_data date:', res1.rows[0].latest_marketing);

        const res2 = await client.query("SELECT COUNT(*) FROM leads_data");
        console.log('Total leads in leads_data:', res2.rows[0].count);

        // Check if leads_data has many recent entries
        // If there's no date in leads_data, we can't tell recency directly without a created_at
        const res3 = await client.query("SELECT * FROM information_schema.columns WHERE table_name = 'leads_data'");
        console.log('Columns in leads_data:', res3.rows.map(r => r.column_name).join(', '));

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkData();
