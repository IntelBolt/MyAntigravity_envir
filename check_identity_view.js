
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

async function checkView() {
    try {
        const client = await pool.connect();

        console.log('--- Current definition of view_full_identity_report in DB ---');
        const res = await client.query("SELECT definition FROM pg_views WHERE viewname = 'view_full_identity_report'");
        console.log(res.rows[0]?.definition || 'View not found');

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkView();
