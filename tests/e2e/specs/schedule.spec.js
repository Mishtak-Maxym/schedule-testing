const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { SchedulePage } = require('../pages/SchedulePage');
const { RoomTypePage } = require('../pages/RoomTypePage');

test.describe('Basic E2E scenarios for schedule system', () => {
  test('schedule page is loaded and main content is visible', async ({ page }) => {
    const schedulePage = new SchedulePage(page);

    await schedulePage.open();

    await schedulePage.expectPageLoaded();
    await expect(page.locator('body')).toBeVisible();
  });

  test('schedule page contains group or schedule controls', async ({ page }) => {
    const schedulePage = new SchedulePage(page);

    await schedulePage.open();

    await expect(page.locator('body')).toContainText(/group|груп|week|тижд|schedule|розклад/i);
  });

  test('login page shows authentication form', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    await loginPage.expectLoginFormVisible();
  });

  test('user can login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login();

    await loginPage.expectAuthenticated();
  });

  test('user can navigate from schedule to RoomType page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const schedulePage = new SchedulePage(page);
    const roomTypePage = new RoomTypePage(page);

    await loginPage.open();
    await loginPage.login();
    await schedulePage.open();
    await roomTypePage.open();

    await roomTypePage.expectPageLoaded();
  });

  test('user can search or filter entities by text', async ({ page }) => {
    const roomTypePage = new RoomTypePage(page);
    const searchValue = process.env.E2E_ROOM_TYPE_SEARCH || 'lecture';

    await roomTypePage.open();
    await roomTypePage.search(searchValue);

    await expect(page.locator('body')).toContainText(new RegExp(searchValue, 'i'));
  });
});
