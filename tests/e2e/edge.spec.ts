import { test, expect } from '@playwright/test';

test('TC-09 Edge Case – Empty Login Fields', async ({ page }) => {
  await page.goto('/login');
  await page.click('button[type="submit"]');
  await expect(page.locator('.error')).toContainText('Username is required');
  await expect(page.locator('.error')).toContainText('Password is required');
});
