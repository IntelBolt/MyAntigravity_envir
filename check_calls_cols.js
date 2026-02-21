
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

async function checkCols() {
    try {
        const client = await pool.connect();
        const res = await client.query("SELECT * FROM information_schema.columns WHERE table_name = 'calls_data'");
        console.log('Columns:', res.rows.map(r => r.column_name).join(', '));
        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkCols();
