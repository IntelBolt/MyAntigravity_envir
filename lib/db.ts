import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: false, // Отключаем SSL, так как это прямой доступ к VPS Postgres
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
