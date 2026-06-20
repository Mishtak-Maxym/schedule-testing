const { expect } = require('@playwright/test');

class RoomTypePage {
  constructor(page) {
    this.page = page;
    this.path = process.env.E2E_ROOM_TYPE_PATH || '/room-types';
    this.searchInput = page.locator('[data-testid="room-type-search"], input[type="search"], input[placeholder*="Search"], input[placeholder*="Пошук"]').first();
    this.nameInput = page.locator('[data-testid="room-type-name"], input[name="name"], input[name="title"], input[placeholder*="Name"], input[placeholder*="Назва"]').first();
    this.descriptionInput = page.locator('[data-testid="room-type-description"], textarea[name="description"], input[name="description"]').first();
    this.createButton = page.getByRole('button', { name: /create|add|new|створити|додати/i }).first();
    this.saveButton = page.getByRole('button', { name: /save|submit|зберегти/i }).first();
  }

  async open() {
    await this.page.goto(this.path);
  }

  async expectPageLoaded() {
    await expect(this.page.locator('body')).toContainText(/room type|room types|тип аудиторії|типи аудиторій/i);
  }

  rowByName(name) {
    return this.page.getByText(name, { exact: false }).first();
  }

  async search(name) {
    await this.searchInput.fill(name);
  }

  async expectSearchResult(name) {
    await expect(this.rowByName(name)).toBeVisible();
  }

  async openCreateForm() {
    await this.createButton.click();
  }

  async fillForm(name, description = '') {
    await this.nameInput.fill(name);
    if (await this.descriptionInput.isVisible().catch(() => false)) {
      await this.descriptionInput.fill(description);
    }
  }

  async save() {
    await this.saveButton.click();
  }

  async createRoomType(name, description = 'Created by Playwright test') {
    await this.openCreateForm();
    await this.fillForm(name, description);
    await this.save();
  }

  async editRoomType(oldName, newName) {
    const row = this.page.locator('tr, [data-testid="room-type-row"], .room-type-row').filter({ hasText: oldName }).first();
    await row.getByRole('button', { name: /edit|update|редагувати/i }).click();
    await this.nameInput.fill(newName);
    await this.save();
  }

  async deleteRoomType(name) {
    const row = this.page.locator('tr, [data-testid="room-type-row"], .room-type-row').filter({ hasText: name }).first();
    await row.getByRole('button', { name: /delete|remove|видалити/i }).click();
    const confirmButton = this.page.getByRole('button', { name: /confirm|yes|ok|так|видалити/i }).first();
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
  }

  async expectRoomTypeVisible(name) {
    await expect(this.rowByName(name)).toBeVisible();
  }

  async expectRoomTypeHidden(name) {
    await expect(this.rowByName(name)).toBeHidden();
  }

  async expectValidationMessage() {
    await expect(this.page.locator('body')).toContainText(/required|обов'язков|обов’язков|cannot be empty|не може бути порожнім/i);
  }
}

module.exports = { RoomTypePage };
