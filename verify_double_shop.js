
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

async function verifyDoubleShop() {
    try {
        const client = await pool.connect();

        console.log('--- Orders grouped by Platform ---');
        const res = await client.query(`
            SELECT source, COUNT(*), SUM(total_price::numeric) as revenue 
            FROM sales_data 
            WHERE client_id = 10234 
            GROUP BY source
        `);
        console.table(res.rows);

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

verifyDoubleShop();
