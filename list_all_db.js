
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

async function listAll() {
    try {
        const client = await pool.connect();

        console.log('--- Tables ---');
        const res1 = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");
        console.log(res1.rows.map(r => r.table_name).join(', '));

        console.log('\n--- Views ---');
        const res2 = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'VIEW'");
        console.log(res2.rows.map(r => r.table_name).join(', '));

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

listAll();
