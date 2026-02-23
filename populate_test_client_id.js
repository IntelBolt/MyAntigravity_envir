
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

        const testClientId = 10234;
        console.log(`Setting client_id = ${testClientId} for 'Тест' client...`);

        await client.query("UPDATE client_credentials SET client_id = $1 WHERE client_name = 'Тест'", [testClientId]);
        await client.query("UPDATE marketing_data SET client_id = $1 WHERE client_name = 'Тест'", [testClientId]);
        await client.query("UPDATE leads_data SET client_id = $1 WHERE client_name = 'Тест'", [testClientId]);
        await client.query("UPDATE calls_data SET client_id = $1 WHERE client_name = 'Тест'", [testClientId]);

        console.log('Verifying updates...');
        const res = await client.query("SELECT client_name, client_id FROM client_credentials");
        console.table(res.rows);

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
