const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString }) : null;
const roomTypeTable = process.env.ROOM_TYPE_TABLE || 'room_type';

function hasDatabase() {
  return Boolean(pool);
}

function safeTableName(tableName) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
    throw new Error('Unsafe table name. Use only letters, numbers and underscore.');
  }
  return tableName;
}

async function query(sql, params = []) {
  if (!pool) {
    throw new Error('DATABASE_URL is not configured. Set DATABASE_URL to enable SQL checks.');
  }
  const result = await pool.query(sql, params);
  return result.rows;
}

async function createRoomTypeFixture(name, description = 'E2E SQL fixture') {
  const table = safeTableName(roomTypeTable);
  const rows = await query(
    `INSERT INTO ${table} (name, description) VALUES ($1, $2) RETURNING id, name, description`,
    [name, description]
  );
  return rows[0];
}

async function findRoomTypeByName(name) {
  const table = safeTableName(roomTypeTable);
  const rows = await query(
    `SELECT id, name, description FROM ${table} WHERE name = $1`,
    [name]
  );
  return rows[0] || null;
}

async function deleteRoomTypeByName(name) {
  const table = safeTableName(roomTypeTable);
  await query(`DELETE FROM ${table} WHERE name = $1`, [name]);
}

async function cleanupRoomTypes(prefix = 'E2E_ROOM_TYPE_') {
  const table = safeTableName(roomTypeTable);
  await query(`DELETE FROM ${table} WHERE name LIKE $1`, [`${prefix}%`]);
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
