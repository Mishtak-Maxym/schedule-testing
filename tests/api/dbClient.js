const { Client } = require('pg');

function isDbEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

function safeIdentifier(value, fallback) {
  const identifier = value || fallback;

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
    throw new Error(`Unsafe database identifier: ${identifier}`);
  }

  return identifier;
}

async function withDatabase(callback) {
  if (!isDbEnabled()) {
    return null;
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await client.connect();

  try {
    return await callback(client);
  } finally {
    await client.end();
  }
}

async function findById(tableName, idColumn, id) {
  return withDatabase(async (client) => {
    const table = safeIdentifier(tableName);
    const column = safeIdentifier(idColumn);
    const result = await client.query(
      `SELECT * FROM ${table} WHERE ${column}::text = $1 LIMIT 1`,
      [String(id)]
    );

    return result.rows[0] || null;
  });
}

async function findClassById(id) {
  const table = safeIdentifier(process.env.CLASS_TABLE, 'classes');
  const idColumn = safeIdentifier(process.env.CLASS_ID_COLUMN, 'id');

  return findById(table, idColumn, id);
}

async function findLessonById(id) {
  const table = safeIdentifier(process.env.LESSON_TABLE, 'lessons');
  const idColumn = safeIdentifier(process.env.LESSON_ID_COLUMN, 'id');

  return findById(table, idColumn, id);
}

module.exports = {
  isDbEnabled,
  findClassById,
  findLessonById
};
