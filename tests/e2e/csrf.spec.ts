import { test, expect } from '@playwright/test';

test('TC-06 CSRF Protection', async ({ request }) => {
  const response = await request.post('https://www.wangdanatest.top/api/submit', {
    data: { foo: 'bar' },
  });
  expect(response.status()).toBe(403);
});
