
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

async function checkCredentials() {
    try {
        const client = await pool.connect();

        console.log('--- Columns in client_credentials ---');
        const res1 = await client.query("SELECT * FROM information_schema.columns WHERE table_name = 'client_credentials'");
        console.log(res1.rows.map(r => r.column_name).join(', '));

        console.log('\n--- Sample data from client_credentials ---');
        const res2 = await client.query("SELECT * FROM client_credentials LIMIT 5");
        console.table(res2.rows.map(r => {
            const { api_key, ...rest } = r; // Mask API key for safety
            return { ...rest, api_key: api_key ? '***' : null };
        }));

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkCredentials();
