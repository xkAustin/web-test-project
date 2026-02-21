import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchResults: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder="Search"]');
    this.searchResults = page.locator('.search-results');
    this.loginButton = page.locator('text=登录'); // Based on web_fetch results
    this.registerButton = page.locator('text=注册');
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }

  async goToLogin() {
    await this.loginButton.click();
  }
}
