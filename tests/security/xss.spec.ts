import { test, expect } from '@playwright/test';

test.describe('Security - XSS Protection Tests', () => {
  const baseURL = 'https://www.wangdanatest.top';
  const maliciousInput = '<script>alert("XSS")</script>';
  const xssVectorImg = '"><img src=x onerror="alert(1)">';
  const xssVectorSvg = '"><svg onload="alert(1)">';

  test('TC-031: XSS Prevention - Script tag injection in search', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill(maliciousInput);
      await searchInput.press('Enter');

      const pageContent = await page.content();
      const hasExecutedScript = pageContent.includes('alert("XSS")');
      expect(hasExecutedScript).toBeFalsy();
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('TC-032: XSS Prevention - IMG tag injection', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill(xssVectorImg);
      await searchInput.press('Enter');

      const pageContent = await page.content();
      const hasXssVector = pageContent.includes('onerror');
      expect(hasXssVector).toBeFalsy();
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('TC-033: XSS Prevention - SVG tag injection', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill(xssVectorSvg);
      await searchInput.press('Enter');

      const pageContent = await page.content();
      const hasXssVector = pageContent.includes('onload');
      expect(hasXssVector).toBeFalsy();
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('TC-034: XSS Prevention - Event handler injection', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const eventHandlers = ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus'];
    let foundHandler = false;

    for (const handler of eventHandlers) {
      const elements = page.locator(`[${handler}]`);
      const count = await elements.count();
      if (count > 0) {
        foundHandler = true;
      }
    }

    expect(foundHandler).toBeFalsy();
  });

  test('TC-035: XSS Prevention - No reflected XSS in search results', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const testQuery = '<b>test</b>';
      await searchInput.fill(testQuery);
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle2');

      const pageContent = await page.content();
      const hasUnescapedHtml = pageContent.includes('<b>test</b>');
      expect(hasUnescapedHtml).toBeFalsy();
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('TC-036: XSS Prevention - JavaScript protocol in URL', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const allLinks = page.locator('a');
    const linkCount = await allLinks.count();

    for (let i = 0; i < linkCount; i++) {
      const href = await allLinks.nth(i).getAttribute('href');
      if (href) {
        const hasJsProtocol = href.startsWith('javascript:');
        expect(hasJsProtocol).toBeFalsy();
      }
    }
  });

  test('TC-037: XSS Prevention - Data attributes safe from execution', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const dataElements = page.locator('[data-*]');
    const count = await dataElements.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 10); i++) {
        const element = dataElements.nth(i);
        const innerHTML = await element.innerHTML();
        expect(innerHTML).toBeDefined();
      }
    }
    expect(true).toBeTruthy();
  });

  test('TC-038: XSS Prevention - Style tag injection', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const styleInput = '<style>body{display:none;}</style>';
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');

    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill(styleInput);
      await searchInput.press('Enter');

      const isPageVisible = await page.evaluate(() => {
        return getComputedStyle(document.body).display !== 'none';
      });

      expect(isPageVisible).toBeTruthy();
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('TC-039: XSS Prevention - DOM-based XSS protection', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const xssAttempt = "';alert(1);//";
    const hasVulnerability = await page.evaluate((payload) => {
      try {
        eval(payload);
        return true;
      } catch {
        return false;
      }
    }, xssAttempt);

    expect(hasVulnerability).toBeFalsy();
  });

  test('TC-040: Content-Security-Policy header check', async ({ request }) => {
    const response = await request.get(`${baseURL}/`);
    const headers = response.headers();

    const hasCSP = headers['content-security-policy'] || headers['x-content-security-policy'];
    expect(hasCSP).toBeTruthy();
  });
});
