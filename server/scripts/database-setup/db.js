const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Force-disable SSL certificate rejection for managed databases (Supabase, Neon, Render)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.PGCLIENTENCODING = 'utf-8';

let connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let poolConfig;
if (connectionString) {
  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
  poolConfig = {
    connectionString: connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  };
} else {
  const isSsl = process.env.DB_SSL === 'true' || (process.env.DB_HOST && !process.env.DB_HOST.includes('localhost') && !process.env.DB_HOST.includes('127.0.0.1'));
  poolConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'fetc_db',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    ssl: isSsl ? { rejectUnauthorized: false } : false
  };
}

const pool = new Pool(poolConfig);

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  close: () => pool.end()
};
