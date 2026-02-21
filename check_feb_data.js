
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

async function checkFeb() {
    try {
        const client = await pool.connect();

        console.log('--- Marketing data in February ---');
        const res1 = await client.query("SELECT COUNT(*) FROM marketing_data WHERE date >= '2026-02-01'");
        console.log('Count:', res1.rows[0].count);

        console.log('\n--- Leads data in February ---');
        const res2 = await client.query("SELECT COUNT(*) FROM leads_data WHERE created_at >= '2026-02-01'");
        console.log('Count:', res2.rows[0].count);

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkFeb();
