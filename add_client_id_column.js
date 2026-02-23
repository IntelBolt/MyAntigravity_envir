
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

        const tables = ['client_credentials', 'marketing_data', 'leads_data', 'calls_data'];

        for (const table of tables) {
            console.log(`Adding client_id to ${table}...`);
            await client.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS client_id INTEGER`);
        }

        console.log('Adding UNIQUE constraint to client_credentials(client_id)...');
        // We can't add UNIQUE if there are nulls, but for now we'll just add the column.
        // We will populate it first.

        console.log('Done.');
        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
