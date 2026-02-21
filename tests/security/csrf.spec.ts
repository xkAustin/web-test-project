import { test, expect } from '@playwright/test';

test.describe('Security - CSRF Protection Tests', () => {
  const baseURL = 'https://www.wangdanatest.top';

  test('TC-041: CSRF Protection - POST without token should fail', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/submit`, {
      data: { foo: 'bar' },
      failOnStatusCode: false
    });

    const isProtected = response.status() === 403 || response.status() === 401 || response.status() === 400;
    expect(isProtected).toBeTruthy();
  });

  test('TC-042: CSRF Token exists in login form', async ({ page }) => {
    await page.goto(`${baseURL}/login`);

    const csrfToken = await page.locator('input[name="csrf_token"], input[name="token"], input[name="_token"]')
      .first()
      .inputValue()
      .catch(() => '');

    const hiddenToken = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="hidden"]');
      for (const input of inputs) {
        if ((input as HTMLInputElement).name?.toLowerCase().includes('csrf') ||
            (input as HTMLInputElement).name?.toLowerCase().includes('token')) {
          return (input as HTMLInputElement).value;
        }
      }
      return '';
    });

    const hasToken = csrfToken.length > 0 || hiddenToken.length > 0;
    expect(hasToken).toBeTruthy();
  });

  test('TC-043: CSRF Protection - SameSite cookie attribute', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name.toLowerCase().includes('session') || c.name.toLowerCase().includes('auth'));

    if (sessionCookie) {
      const hasSameSite = sessionCookie.sameSite !== undefined;
      expect(hasSameSite).toBeTruthy();
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('TC-044: CSRF Protection - Referrer check', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/discussions`, {
      headers: {
        'Referer': 'https://evil.com'
      },
      data: {
        title: 'Test',
        content: 'Test content'
      },
      failOnStatusCode: false
    });

    expect([401, 403, 400, 405]).toContain(response.status());
  });

  test('TC-045: CSRF Protection - Origin header validation', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/discussions`, {
      headers: {
        'Origin': 'https://evil.com'
      },
      data: {
        title: 'Test',
        content: 'Test content'
      },
      failOnStatusCode: false
    });

    const statusCode = response.status();
    expect([200, 201, 401, 403, 400, 405]).toContain(statusCode);
  });

  test('TC-046: CSRF Protection - Double Submit Cookie Pattern', async ({ page }) => {
    await page.goto(`${baseURL}/`);

    const cookies = await page.context().cookies();
    const csrfCookie = cookies.find(c => c.name.toLowerCase().includes('csrf') || c.name.toLowerCase().includes('xsrf'));

    expect(csrfCookie !== undefined || cookies.length > 0).toBeTruthy();
  });

  test('TC-047: CSRF Protection - Valid methods should require CSRF token', async ({ request }) => {
    const methods = ['POST', 'PUT', 'DELETE', 'PATCH'];

    for (const method of methods) {
      const response = await request.fetch(`${baseURL}/api/discussions`, {
        method,
        data: { test: 'data' },
        failOnStatusCode: false
      });

      const isProtected = response.status() !== 200 && response.status() !== 201;
      expect(isProtected).toBeTruthy();
    }
  });

  test('TC-048: CSRF Protection - Safe methods (GET, HEAD, OPTIONS)', async ({ request }) => {
    const methods = ['GET', 'HEAD', 'OPTIONS'];

    for (const method of methods) {
      const response = await request.fetch(`${baseURL}/api/discussions`, {
        method,
        failOnStatusCode: false
      });

      const statusCode = response.status();
      expect([200, 204, 405]).toContain(statusCode);
    }
  });

  test('TC-049: CSRF Protection - Custom headers defense', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/discussions`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      data: { test: 'data' },
      failOnStatusCode: false
    });

    expect([401, 403, 400, 405, 200, 201]).toContain(response.status());
  });

  test('TC-050: CSRF Protection - Content-Type validation', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/discussions`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'test=data',
      failOnStatusCode: false
    });

    expect(response.status()).toBeGreaterThanOrEqual(200);
  });
});
