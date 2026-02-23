
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: 5434,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: false,
});

async function run() {
    try {
        const client = await pool.connect();
        const views = ['view_full_identity_report', 'view_managers_performance'];
        for (const view of views) {
            console.log(`\n--- Definition for ${view} ---`);
            const res = await client.query(`SELECT pg_get_viewdef('${view}')`);
            console.log(res.rows[0].pg_get_viewdef);
        }
        client.release();
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

run();
