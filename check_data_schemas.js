
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: 5434,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: false,
});

async function run() {
    try {
        const client = await pool.connect();
        const tables = ['marketing_data', 'leads_data', 'calls_data'];
        for (const table of tables) {
            console.log(`\n--- Schema for ${table} ---`);
            const res = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}'`);
            console.table(res.rows);
        }
        client.release();
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

run();
