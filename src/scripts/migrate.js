require('dotenv').config({ path: '.env' });
const pool = require('./../lib/db.js');

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    code VARCHAR(8) UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    last_clicked TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX IF NOT EXISTS idx_code ON links(code);
`;

async function migrate() {
  try {
    await pool.query(createTableSQL);
    console.log('Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
