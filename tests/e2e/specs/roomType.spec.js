const { test, expect } = require('@playwright/test');
const { RoomTypePage } = require('../pages/RoomTypePage');
const { SchedulePage } = require('../pages/SchedulePage');

function uniqueRoomTypeName() {
  return `E2E_ROOM_TYPE_${Date.now()}`;
}

test.describe('Complex E2E scenarios for RoomType and schedule', () => {
  test('CRUD through UI: create, view, edit and delete RoomType', async ({ page }) => {
    const roomTypePage = new RoomTypePage(page);
    const name = uniqueRoomTypeName();
    const updatedName = `${name}_UPDATED`;

    await roomTypePage.open();
    await roomTypePage.createRoomType(name);
    await roomTypePage.expectRoomTypeVisible(name);

    await roomTypePage.editRoomType(name, updatedName);
    await roomTypePage.expectRoomTypeVisible(updatedName);

    await roomTypePage.deleteRoomType(updatedName);
    await roomTypePage.expectRoomTypeHidden(updatedName);
  });

  test('form validation: RoomType cannot be saved with empty required name', async ({ page }) => {
    const roomTypePage = new RoomTypePage(page);

    await roomTypePage.open();
    await roomTypePage.openCreateForm();
    await roomTypePage.fillForm('', 'Invalid room type without name');
    await roomTypePage.save();

    await roomTypePage.expectValidationMessage();
  });

  test('drag and drop: lesson can be moved to selected schedule time slot', async ({ page }) => {
    const schedulePage = new SchedulePage(page);
    const lessonName = process.env.E2E_LESSON_NAME || 'Test lesson';
    const slotName = process.env.E2E_TIME_SLOT || 'Monday 09:00';

    await schedulePage.open();
    await schedulePage.dragLessonToTimeSlot(lessonName, slotName);

    await schedulePage.expectLessonInSlot(lessonName, slotName);
  });

  test('lesson details can be opened from schedule', async ({ page }) => {
    const schedulePage = new SchedulePage(page);
    const lessonName = process.env.E2E_LESSON_NAME || 'Test lesson';

    await schedulePage.open();
    await schedulePage.openLessonDetails(lessonName);

    await schedulePage.expectLessonDetailsVisible();
  });
});
