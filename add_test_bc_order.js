
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

async function addTestBigCommerceOrder() {
    const client = await pool.connect();
    try {
        const clientId = 10234;
        const source = 'bigcommerce';

        console.log(`Adding test order for ${source}...`);

        await client.query(`
            INSERT INTO sales_data (
                client_id, order_id, total_price, currency, customer_name, status, source, 
                order_number, customer_email, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        `, [
            clientId,
            'bc-order-999',
            '1250.00',
            'USD',
            'John BigCommerce',
            'paid',
            source,
            '#BC-1001',
            'john@example.com'
        ]);

        console.log('Test order added successfully!');

    } catch (err) {
        console.error('Error adding test order:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

addTestBigCommerceOrder();
