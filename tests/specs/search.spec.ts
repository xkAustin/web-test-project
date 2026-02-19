import { test, expect } from '@playwright/test';

const SEARCH_TERM = 'test';

test('TC-05 Search Functionality', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[placeholder="Search"]', SEARCH_TERM);
  await page.press('input[placeholder="Search"]', 'Enter');
  await expect(page.locator('.search-results')).toBeVisible();
  await expect(page.locator('.search-results >> li')).toHaveCountGreaterThan(0);
});
