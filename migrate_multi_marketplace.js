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
        console.log('Starting DB migration: marketplace_credentials...');

        // Create marketplace_credentials table to support N marketplaces per client
        await client.query(`
            CREATE TABLE IF NOT EXISTS marketplace_credentials (
                id SERIAL PRIMARY KEY,
                client_id INTEGER NOT NULL,
                platform_type TEXT NOT NULL, -- 'ozon', 'wildberries', 'kaspi', 'shopify'
                shop_name TEXT,
                api_key TEXT,
                api_secret TEXT,
                shop_url TEXT,
                shop_id TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(client_id, platform_type, shop_id)
            );
        `);
        console.log('Created marketplace_credentials table');

        // Add index
        await client.query(`CREATE INDEX IF NOT EXISTS idx_mc_client_id ON marketplace_credentials(client_id);`);
        console.log('Created index on marketplace_credentials(client_id)');

        // Migrate existing single shop from client_credentials to the new table if present
        const existingRes = await client.query(`
            SELECT client_id, shop_type, shop_url, shop_api_key, shop_api_secret, shop_id 
            FROM client_credentials 
            WHERE shop_type IS NOT NULL
        `);

        for (const row of existingRes.rows) {
            await client.query(`
                INSERT INTO marketplace_credentials (client_id, platform_type, shop_url, api_key, api_secret, shop_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (client_id, platform_type, shop_id) DO NOTHING
            `, [row.client_id, row.shop_type.toLowerCase(), row.shop_url, row.shop_api_key, row.shop_api_secret, row.shop_id]);
        }
        console.log(`Migrated ${existingRes.rowCount} existing connections.`);

    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

run();
