
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

async function checkClients() {
    try {
        const client = await pool.connect();

        console.log('--- Client names in marketing_data ---');
        const res1 = await client.query("SELECT DISTINCT client_name FROM marketing_data");
        console.table(res1.rows);

        console.log('\n--- Client names in leads_data ---');
        const res2 = await client.query("SELECT DISTINCT client_name FROM leads_data");
        console.table(res2.rows);

        console.log('\n--- Latest data with client_name != "Тест" ---');
        const res3 = await client.query("SELECT MAX(date) as latest FROM marketing_data WHERE client_name != 'Тест'");
        console.log('Latest non-test marketing data:', res3.rows[0].latest);

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkClients();
