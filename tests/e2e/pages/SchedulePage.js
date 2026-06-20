const { expect } = require('@playwright/test');

class SchedulePage {
  constructor(page) {
    this.page = page;
    this.path = process.env.E2E_SCHEDULE_PATH || '/schedule';
    this.groupSelect = page.locator('[data-testid="group-select"], select[name="group"], [role="combobox"]').first();
    this.weekSwitch = page.locator('[data-testid="week-switch"], [data-testid="week-type"], select[name="weekType"]').first();
    this.searchInput = page.locator('[data-testid="schedule-search"], input[type="search"], input[placeholder*="Search"], input[placeholder*="Пошук"]').first();
  }

  async open() {
    await this.page.goto(this.path);
  }

  async expectPageLoaded() {
    await expect(this.page.locator('body')).toContainText(/schedule|розклад|lesson|занят/i);
  }

  async selectGroup(groupName = process.env.E2E_GROUP_NAME || 'Test Group') {
    if (!(await this.groupSelect.isVisible().catch(() => false))) return;
    await this.groupSelect.click();
    const option = this.page.getByText(groupName, { exact: false }).first();
    if (await option.isVisible().catch(() => false)) {
      await option.click();
      return;
    }
    await this.page.keyboard.press('Escape').catch(() => {});
  }

  async switchWeekType(type = 'even') {
    if (!(await this.weekSwitch.isVisible().catch(() => false))) return;
    await this.weekSwitch.click();
    const text = type === 'even' ? /even|парний/i : /odd|непарний/i;
    const option = this.page.getByText(text).first();
    if (await option.isVisible().catch(() => false)) {
      await option.click();
    }
  }

  async search(text) {
    await this.searchInput.fill(text);
  }

  async expectLessonVisible(text) {
    await expect(this.page.getByText(text, { exact: false }).first()).toBeVisible();
  }

  async openLessonDetails(text) {
    await this.page.getByText(text, { exact: false }).first().click();
  }

  async expectLessonDetailsVisible() {
    await expect(this.page.locator('body')).toContainText(/teacher|викладач|room|аудитор|time|час|type|тип/i);
  }

  async dragLessonToTimeSlot(lessonName = process.env.E2E_LESSON_NAME || 'Test lesson', slotName = process.env.E2E_TIME_SLOT || 'Monday 09:00') {
    const lesson = this.page.locator('[data-testid="lesson-card"], .lesson-card, [draggable="true"]').filter({ hasText: lessonName }).first();
    const slot = this.page.locator('[data-testid="time-slot"], .time-slot, td').filter({ hasText: slotName }).first();
    await lesson.dragTo(slot);
  }

  async expectLessonInSlot(lessonName = process.env.E2E_LESSON_NAME || 'Test lesson', slotName = process.env.E2E_TIME_SLOT || 'Monday 09:00') {
    const slot = this.page.locator('[data-testid="time-slot"], .time-slot, td').filter({ hasText: slotName }).first();
    await expect(slot).toContainText(lessonName);
  }
}

module.exports = { SchedulePage };
