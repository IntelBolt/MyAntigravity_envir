
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

async function addBigCommerce() {
    const client = await pool.connect();
    try {
        const clientId = 10234; // Our test client
        const platformType = 'bigcommerce';
        const shopName = 'IntelBolt analytics';
        const accessToken = 'hft00n0ikh9vov785hvfz5hlicnelht';
        const clientSecret = 'af031f8cf11c49f384993e395a82903eb86f6b73d77a56570d473b683d412a77';
        const apiPath = 'https://api.bigcommerce.com/stores/aftam5islz/v3/';
        const storeHash = 'aftam5islz';

        console.log(`Adding ${platformType} for client ${clientId}...`);

        await client.query(`
            INSERT INTO marketplace_credentials (
                client_id, platform_type, shop_name, api_key, api_secret, shop_url, shop_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (client_id, platform_type, shop_id) 
            DO UPDATE SET 
                shop_name = EXCLUDED.shop_name,
                api_key = EXCLUDED.api_key,
                api_secret = EXCLUDED.api_secret,
                shop_url = EXCLUDED.shop_url,
                is_active = TRUE;
        `, [clientId, platformType, shopName, accessToken, clientSecret, apiPath, storeHash]);

        console.log('Successfully connected BigCommerce!');

        // List all to verify
        const res = await client.query("SELECT * FROM marketplace_credentials WHERE client_id = $1", [clientId]);
        console.table(res.rows);

    } catch (err) {
        console.error('Error adding BigCommerce:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

addBigCommerce();
