import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  const baseURL = 'https://www.wangdanatest.top';

  test('GET /api/discussions should return 200', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/discussions`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body.data)).toBeTruthy();
  });

  test('GET /api/tags should return 200', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/tags`);
    expect(response.status()).toBe(200);
  });
});
