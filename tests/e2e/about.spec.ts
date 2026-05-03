import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('TC-091 Navigation to About page', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateTo('/');
  await page.locator('a:has-text("About"), a:has-text("关于")').click();

  await expect(page).toHaveURL(/about/i);
  await expect(page.locator('h1').first()).toBeVisible();
});
