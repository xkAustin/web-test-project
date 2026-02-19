import { test, expect } from '@playwright/test';

test('TC-01 Home Page Loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Wang Dan Test/);
  // Check header and footer
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
});
