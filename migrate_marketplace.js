
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
        console.log('Starting DB migration...');

        // 1. Add marketplace columns to client_credentials
        await client.query(`
            ALTER TABLE client_credentials 
            ADD COLUMN IF NOT EXISTS shop_url TEXT,
            ADD COLUMN IF NOT EXISTS shop_api_key TEXT,
            ADD COLUMN IF NOT EXISTS shop_api_secret TEXT,
            ADD COLUMN IF NOT EXISTS shop_id TEXT,
            ADD COLUMN IF NOT EXISTS shop_type TEXT;
        `);
        console.log('Added marketplace columns to client_credentials');

        // 2. Create sales_data table
        await client.query(`
            CREATE TABLE IF NOT EXISTS sales_data (
                id SERIAL PRIMARY KEY,
                client_id INTEGER NOT NULL,
                order_id TEXT NOT NULL,
                source TEXT NOT NULL,
                total_price DECIMAL(15, 2),
                currency TEXT DEFAULT 'RUB',
                customer_name TEXT,
                status TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(client_id, order_id, source)
            );
        `);
        console.log('Created sales_data table');

        // 3. Add index for faster filtering
        await client.query(`CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales_data(client_id);`);
        console.log('Created index on sales_data(client_id)');

    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

run();
