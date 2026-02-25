
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

async function run() {
    const client = await pool.connect();
    try {
        console.log('Expanding sales_data table with analytical fields...');

        await client.query(`
            ALTER TABLE sales_data 
            ADD COLUMN IF NOT EXISTS customer_email TEXT,
            ADD COLUMN IF NOT EXISTS order_number TEXT,
            ADD COLUMN IF NOT EXISTS source_customer_id TEXT,
            ADD COLUMN IF NOT EXISTS landing_site TEXT;
        `);
        console.log('Successfully added: customer_email, order_number, source_customer_id, landing_site');

    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

run();
