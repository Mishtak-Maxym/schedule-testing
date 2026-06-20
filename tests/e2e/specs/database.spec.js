const { test, expect } = require('@playwright/test');
const {
  hasDatabase,
  createRoomTypeFixture,
  findRoomTypeByName,
  deleteRoomTypeByName,
  cleanupRoomTypes,
  closeDatabase
} = require('../helpers/database');

const runDatabaseTests = hasDatabase();

test.describe('SQL setup, verification and cleanup for RoomType', () => {
  test.skip(!runDatabaseTests, 'DATABASE_URL is not configured, SQL checks are skipped');

  test.beforeEach(async () => {
    await cleanupRoomTypes();
  });

  test.afterAll(async () => {
    if (runDatabaseTests) {
      await cleanupRoomTypes();
      await closeDatabase();
    }
  });

  test('setup and verification: RoomType fixture is created in database', async () => {
    const name = `E2E_ROOM_TYPE_${Date.now()}`;

    const created = await createRoomTypeFixture(name);
    const found = await findRoomTypeByName(name);

    expect(created.name).toBe(name);
    expect(found).not.toBeNull();
    expect(found.name).toBe(name);
  });

  test('cleanup: test RoomType data is removed from database', async () => {
    const name = `E2E_ROOM_TYPE_${Date.now()}`;

    await createRoomTypeFixture(name);
    await deleteRoomTypeByName(name);
    const found = await findRoomTypeByName(name);

    expect(found).toBeNull();
  });
});
