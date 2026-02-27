
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

async function checkBigCommerceData() {
    try {
        const client = await pool.connect();

        console.log('--- Latest BigCommerce Orders in sales_data ---');
        const res = await client.query(`
            SELECT 
                id, 
                client_id, 
                order_id, 
                order_number, 
                total_price, 
                currency, 
                customer_name, 
                customer_email, 
                status, 
                source, 
                created_at 
            FROM sales_data 
            WHERE source = 'bigcommerce' 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        console.table(res.rows);

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkBigCommerceData();
