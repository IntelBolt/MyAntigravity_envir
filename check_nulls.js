
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

async function checkNulls() {
    try {
        const client = await pool.connect();

        console.log('--- Checking for rows where client_name is not "Тест" in marketing_data ---');
        const res1 = await client.query("SELECT COUNT(*) FROM marketing_data WHERE client_name != 'Тест' OR client_name IS NULL");
        console.log('Count:', res1.rows[0].count);

        if (res1.rows[0].count > 0) {
            const res2 = await client.query("SELECT DISTINCT client_name FROM marketing_data WHERE client_name != 'Тест' OR client_name IS NULL");
            console.log('Other client names:', res2.rows.map(r => r.client_name));
        }

        console.log('\n--- Checking MAX(date) for ALL marketing_data ---');
        const res3 = await client.query("SELECT MAX(date) FROM marketing_data");
        console.log('Max date overall:', res3.rows[0].max);

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkNulls();
