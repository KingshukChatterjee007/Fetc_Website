const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Force-disable SSL certificate validation (Fix for Supabase/Vercel certificate chain error)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.PGCLIENTENCODING = 'utf-8';


let connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.Databse_POSTGRES_URL;

// If we have a cloud connection string, force sslmode=no-verify to kill that certificate error
if (connectionString && !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1')) {
  connectionString += connectionString.includes('?') ? '&sslmode=no-verify' : '?sslmode=no-verify';
}

const pool = new Pool(
  connectionString
    ? { 
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false } 
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);

pool.on('connect', () => {
  console.log('Successfully connected to PostgreSQL');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
