
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

async function checkTables() {
    try {
        const client = await pool.connect();
        const res = await client.query("SELECT table_name FROM information_schema.views WHERE table_schema = 'public'");
        console.log('Views in public schema:', res.rows.map(r => r.table_name).join(', '));
        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkTables();
