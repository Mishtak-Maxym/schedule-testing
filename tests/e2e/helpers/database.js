const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString }) : null;

function hasDatabase() {
  return Boolean(pool);
}

async function query(sql, params = []) {
  if (!pool) {
    throw new Error('DATABASE_URL is not configured. Set DATABASE_URL to enable SQL checks.');
  }
  const result = await pool.query(sql, params);
  return result.rows;
}

async function createRoomTypeFixture(name, description = 'E2E SQL fixture') {
  const rows = await query(
    'INSERT INTO room_type (name, description) VALUES ($1, $2) RETURNING id, name, description',
    [name, description]
  );
  return rows[0];
}

async function findRoomTypeByName(name) {
  const rows = await query(
    'SELECT id, name, description FROM room_type WHERE name = $1',
    [name]
  );
  return rows[0] || null;
}

async function deleteRoomTypeByName(name) {
  await query('DELETE FROM room_type WHERE name = $1', [name]);
}

async function cleanupRoomTypes(prefix = 'E2E_ROOM_TYPE_') {
  await query('DELETE FROM room_type WHERE name LIKE $1', [`${prefix}%`]);
}

async function closeDatabase() {
  if (pool) {
    await pool.end();
  }
}

module.exports = {
  hasDatabase,
  query,
  createRoomTypeFixture,
  findRoomTypeByName,
  deleteRoomTypeByName,
  cleanupRoomTypes,
  closeDatabase
};
