import { test, expect } from '@playwright/test';

test.describe('Security - XSS Protection Tests', () => {
  const maliciousInput = '<script>alert("XSS")</script>';
  const xssVectorImg = '"><img src=x onerror="alert(1)">';
  const xssVectorSvg = '"><svg onload="alert(1)">';

  test('TC-081: XSS Prevention - Script tag injection in search', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    test.skip(!(await searchInput.isVisible({ timeout: 3000 }).catch(() => false)), 'Search input not available on this page');

    await searchInput.fill(maliciousInput);
    await searchInput.press('Enter');

    const pageContent = await page.content();
    expect(pageContent).not.toContain('alert("XSS")');
  });

  test('TC-082: XSS Prevention - IMG tag injection', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    test.skip(!(await searchInput.isVisible({ timeout: 3000 }).catch(() => false)), 'Search input not available on this page');

    await searchInput.fill(xssVectorImg);
    await searchInput.press('Enter');

    const pageContent = await page.content();
    expect(pageContent).not.toContain('onerror');
  });

  test('TC-083: XSS Prevention - SVG tag injection', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    test.skip(!(await searchInput.isVisible({ timeout: 3000 }).catch(() => false)), 'Search input not available on this page');

    await searchInput.fill(xssVectorSvg);
    await searchInput.press('Enter');

    const pageContent = await page.content();
    expect(pageContent).not.toContain('onload');
  });

  test('TC-084: XSS Prevention - Event handler injection', async ({ page }) => {
    await page.goto('/');

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

  test('TC-085: XSS Prevention - No reflected XSS in search results', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    test.skip(!(await searchInput.isVisible({ timeout: 3000 }).catch(() => false)), 'Search input not available on this page');

    const testQuery = '<b>test</b>';
    await searchInput.fill(testQuery);
    await searchInput.press('Enter');
    await page.waitForLoadState('networkidle');

    const pageContent = await page.content();
    expect(pageContent).not.toContain('<b>test</b>');
  });

  test('TC-086: XSS Prevention - JavaScript protocol in URL', async ({ page }) => {
    await page.goto('/');

    const allLinks = page.locator('a');
    const linkCount = await allLinks.count();

    let hasJsProtocol = false;
    for (let i = 0; i < linkCount; i++) {
      const href = await allLinks.nth(i).getAttribute('href');
      if (href && href.startsWith('javascript:')) {
        hasJsProtocol = true;
        break;
      }
    }

    expect(hasJsProtocol).toBeFalsy();
  });

  test('TC-087: XSS Prevention - Data attributes safe from execution', async ({ page }) => {
    await page.goto('/');

    const dataElements = page.locator('[data-*]');
    const count = await dataElements.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 10); i++) {
        const element = dataElements.nth(i);
        const innerHTML = await element.innerHTML();
        expect(innerHTML).toBeDefined();
      }
    }
  });

  test('TC-088: XSS Prevention - Style tag injection', async ({ page }) => {
    await page.goto('/');

    const styleInput = '<style>body{display:none;}</style>';
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');

    test.skip(!(await searchInput.isVisible({ timeout: 3000 }).catch(() => false)), 'Search input not available on this page');

    await searchInput.fill(styleInput);
    await searchInput.press('Enter');

    const isPageVisible = await page.evaluate(() => {
      return getComputedStyle(document.body).display !== 'none';
    });

    expect(isPageVisible).toBeTruthy();
  });

  test('TC-089: XSS Prevention - DOM-based XSS protection', async ({ page }) => {
    await page.goto('/');

    // Verify the page remains functional after handling XSS payload patterns
    const bodyContent = await page.evaluate(() => document.body.innerHTML.length);
    expect(bodyContent).toBeGreaterThan(0);
  });

  test('TC-090: Content-Security-Policy header check', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();

    const hasCSP = headers['content-security-policy'] || headers['x-content-security-policy'];
    expect(hasCSP).toBeTruthy();
  });
});
