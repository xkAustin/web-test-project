import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'networkidle2' });
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForElement(selector: string, timeout = 30000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async getPageUrl(): Promise<string> {
    return this.page.url();
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  async waitForNavigation(action: () => Promise<void>) {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
      action()
    ]);
  }

  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getElementText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  async getPageMetaDescription(): Promise<string | null> {
    return await this.page.locator('meta[name="description"]').getAttribute('content');
  }

  async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async dismissCookieBanner() {
    const bannerSelector = '[class*="cookie"]';
    try {
      const banner = this.page.locator(bannerSelector).first();
      if (await banner.isVisible({ timeout: 5000 })) {
        const closeButton = banner.locator('button:has-text("Accept"), button:has-text("Close"), [aria-label*="close"]');
        await closeButton.click().catch(() => {});
      }
    } catch {
      // Cookie banner might not exist
    }
  }

  async acceptCookies() {
    try {
      const acceptButton = this.page.locator('button:has-text("Accept"), button:has-text("同意")');
      if (await acceptButton.isVisible({ timeout: 5000 })) {
        await acceptButton.click();
      }
    } catch {
      // Cookies might already be accepted
    }
  }
}
