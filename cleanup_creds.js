
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

async function cleanup() {
    try {
        const client = await pool.connect();

        console.log('--- Cleaning up client_credentials ---');
        const res = await client.query("DELETE FROM client_credentials WHERE client_name = 'undefined' OR client_name IS NULL");
        console.log(`Deleted ${res.rowCount} invalid rows from client_credentials.`);

        // Check the data again
        const res2 = await client.query("SELECT id, client_name, client_id, subdomain FROM client_credentials");
        console.table(res2.rows);

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

cleanup();
