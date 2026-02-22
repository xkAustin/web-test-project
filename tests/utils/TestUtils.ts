import { Page, Route } from '@playwright/test';

export class TestUtils {
  /**
   * Wait for an element to be visible with custom timeout
   */
  static async waitForElementVisible(
    page: Page,
    selector: string,
    timeout = 5000
  ): Promise<boolean> {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Fill form field with validation
   */
  static async fillForm(page: Page, fields: Record<string, string>): Promise<void> {
    for (const [selector, value] of Object.entries(fields)) {
      await page.fill(selector, value);
    }
  }

  /**
   * Get all console logs
   */
  static async captureConsoleLogs(page: Page, callback: () => Promise<void>): Promise<string[]> {
    const logs: string[] = [];
    page.on('console', (msg) => logs.push(`${msg.type()}: ${msg.text()}`));
    await callback();
    return logs;
  }

  /**
   * Wait for network idle
   */
  static async waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
    await page.waitForLoadState('networkidle2', { timeout });
  }

  /**
   * Take a full page screenshot
   */
  static async takeFullPageScreenshot(page: Page, filename: string): Promise<void> {
    await page.screenshot({ path: `screenshots/${filename}.png`, fullPage: true });
  }

  /**
   * Get performance metrics
   */
  static async getPerformanceMetrics(page: Page): Promise<Record<string, number>> {
    return await page.evaluate(() => {
      const perfData = performance.timing;
      return {
        pageLoadTime: perfData.loadEventEnd - perfData.navigationStart,
        connectTime: perfData.connectEnd - perfData.connectStart,
        renderTime: perfData.domComplete - perfData.domLoading,
      };
    });
  }

  /**
   * Execute JavaScript and return value
   */
  static async executeScript<T>(page: Page, script: string): Promise<T> {
    return await page.evaluate(script) as T;
  }

  /**
   * Wait for element to be stable (no DOM changes)
   */
  static async waitForElementStable(
    page: Page,
    selector: string,
    timeout = 5000
  ): Promise<boolean> {
    try {
      const element = page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element visibility status
   */
  static async isElementVisible(page: Page, selector: string): Promise<boolean> {
    try {
      const element = page.locator(selector);
      return await element.isVisible({ timeout: 2000 }).catch(() => false);
    } catch {
      return false;
    }
  }

  /**
   * Get element text content
   */
  static async getElementText(page: Page, selector: string): Promise<string> {
    const element = page.locator(selector);
    return (await element.textContent()) || '';
  }

  /**
   * Check if element contains text
   */
  static async elementContainsText(
    page: Page,
    selector: string,
    text: string
  ): Promise<boolean> {
    const element = page.locator(selector);
    const content = await element.textContent();
    return content?.includes(text) ?? false;
  }

  /**
   * Wait and click element
   */
  static async waitAndClick(page: Page, selector: string, timeout = 5000): Promise<void> {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
  }

  /**
   * Get all element attributes
   */
  static async getElementAttributes(
    page: Page,
    selector: string
  ): Promise<Record<string, string | null>> {
    return await page.evaluate((sel) => {
      const element = document.querySelector(sel) as HTMLElement;
      if (!element) return {};

      const attrs: Record<string, string | null> = {};
      for (const attr of element.attributes) {
        attrs[attr.name] = attr.value;
      }
      return attrs;
    }, selector);
  }

  /**
   * Check network response status
   */
  static async verifyNetworkRequest(
    page: Page,
    url: string,
    expectedStatus = 200
  ): Promise<boolean> {
    let requestFound = false;
    page.on('response', (response) => {
      if (response.url().includes(url) && response.status() === expectedStatus) {
        requestFound = true;
      }
    });

    await TestUtils.waitForNetworkIdle(page);
    return requestFound;
  }

  /**
   * Clear all cookies
   */
  static async clearCookies(page: Page): Promise<void> {
    await page.context().clearCookies();
  }

  /**
   * Get all cookies
   */
  static async getCookies(page: Page): Promise<Record<string, string>> {
    const cookies = await page.context().cookies();
    const cookieObj: Record<string, string> = {};
    cookies.forEach((cookie) => {
      cookieObj[cookie.name] = cookie.value;
    });
    return cookieObj;
  }

  /**
   * Set custom headers
   */
  static async setHeaders(page: Page, headers: Record<string, string>): Promise<void> {
    await page.setExtraHTTPHeaders(headers);
  }

  /**
   * Intercept network request
   */
  static async interceptRequest(
    page: Page,
    urlPattern: string | RegExp,
    callback: (route: Route) => void
  ): Promise<void> {
    await page.route(urlPattern, callback);
  }

  /**
   * Get page size and viewport
   */
  static async getPageSize(page: Page): Promise<{ width: number; height: number }> {
    const size = page.viewportSize();
    return size || { width: 0, height: 0 };
  }

  /**
   * Simulate network throttling
   */
  static async throttleNetwork(page: Page): Promise<void> {
    await page.route('**/*', async (route) => {
      const response = await route.response();
      if (response) {
        await route.continue();
      }
    });
  }

  /**
   * Generate unique email for testing
   */
  static generateTestEmail(prefix = 'test'): string {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}@test.com`;
  }

  /**
   * Generate random string
   */
  static generateRandomString(length = 10): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  /**
   * Retry function with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delayMs = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
    throw new Error('Max retries exceeded');
  }
}

export default TestUtils;
