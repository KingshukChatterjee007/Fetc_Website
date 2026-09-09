const { pool, close } = require('./db');

async function testConnection() {
  console.log('======================================================');
  console.log('🔍 Testing PostgreSQL Database Connection...');
  console.log('======================================================');

  try {
    const client = await pool.connect();
    const infoRes = await client.query(`
      SELECT 
        current_database() as db_name,
        current_user as db_user,
        version() as pg_version,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port
    `);
    
    const info = infoRes.rows[0];
    console.log('✅ Connection Successful!');
    console.log(`   Database : ${info.db_name}`);
    console.log(`   User     : ${info.db_user}`);
    console.log(`   Server   : ${info.server_ip || 'localhost'}:${info.server_port || '5432'}`);
    console.log(`   Version  : ${info.pg_version.split(' on ')[0]}`);
    console.log('======================================================');
    client.release();
    await close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Connection Failed:');
    console.error(`   Message: ${err.message}`);
    if (err.code) {
      console.error(`   Code   : ${err.code}`);
    }
    console.log('\n💡 Troubleshooting Tips:');
    console.log('   1. Verify your .env file exists and has correct DB_USER, DB_PASSWORD, DB_NAME, DB_HOST.');
    console.log('   2. If using cloud PostgreSQL (Neon, Supabase), verify DATABASE_URL is correct.');
    console.log('   3. Ensure PostgreSQL server is running and accepting connections on that port.');
    console.log('======================================================\n');
    await close();
    process.exit(1);
  }
}

testConnection();
