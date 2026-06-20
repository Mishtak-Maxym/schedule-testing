const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.path = process.env.E2E_LOGIN_PATH || '/login';
    this.usernameInput = page.locator('[data-testid="username"], [data-test="username"], input[name="username"], input[name="email"], input[type="email"]').first();
    this.passwordInput = page.locator('[data-testid="password"], [data-test="password"], input[name="password"], input[type="password"]').first();
    this.submitButton = page.getByRole('button', { name: /login|sign in|увійти|вхід/i }).first();
    this.logoutButton = page.getByRole('button', { name: /logout|sign out|вийти/i }).first();
  }

  async open() {
    await this.page.goto(this.path);
  }

  async login(username = process.env.E2E_USERNAME || 'admin', password = process.env.E2E_PASSWORD || 'admin') {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoginFormVisible() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectAuthenticated() {
    await expect(this.page).not.toHaveURL(/\/login$/);
  }

  async logoutIfVisible() {
    if (await this.logoutButton.isVisible().catch(() => false)) {
      await this.logoutButton.click();
    }
  }
}

module.exports = { LoginPage };
