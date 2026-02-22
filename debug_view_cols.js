
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

async function checkCols() {
    try {
        const client = await pool.connect();
        const views = ['marketing_data', 'view_mega_report', 'view_full_identity_report', 'final_analytics_report'];
        for (const view of views) {
            try {
                const res = await client.query(`SELECT * FROM ${view} LIMIT 1`);
                console.log(`\nCols for ${view}:`, Object.keys(res.rows[0] || {}).join(', '));
            } catch (e) {
                console.log(`\nFailed to read ${view}:`, e.message);
            }
        }
        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
checkCols();
