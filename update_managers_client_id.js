
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

        console.log('Adding client_id to managers_data...');
        await client.query("ALTER TABLE managers_data ADD COLUMN IF NOT EXISTS client_id INTEGER");

        console.log('Finding managers for "Тест" in leads_data...');
        const res = await client.query("SELECT DISTINCT responsible_id FROM leads_data WHERE client_name = 'Тест'");
        const managerIds = res.rows.map(r => r.responsible_id).filter(id => id !== null);

        if (managerIds.length > 0) {
            console.log(`Setting client_id = 10234 for managers: ${managerIds.join(', ')}...`);
            await client.query("UPDATE managers_data SET client_id = 10234 WHERE manager_id = ANY($1)", [managerIds]);
        }

        console.log('Done.');
        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
