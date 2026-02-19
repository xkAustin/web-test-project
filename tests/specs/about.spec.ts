import { test, expect } from '@playwright/test';

test('TC-02 Navigation – About', async ({ page }) => {
  await page.goto('/');
  await page.click('text=About');
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator('h1')).toContainText('About');
});
