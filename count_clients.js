
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

async function countAll() {
    try {
        const client = await pool.connect();
        const res = await client.query("SELECT COUNT(*) FROM client_credentials");
        console.log('Total clients in client_credentials:', res.rows[0].count);

        const resList = await client.query("SELECT client_name FROM client_credentials");
        console.log('Client names:', resList.rows.map(r => r.client_name).join(', '));

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

countAll();
