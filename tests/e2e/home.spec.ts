import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('TC-01 Home Page Loads', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateTo();
  
  const title = await homePage.getTitle();
  expect(title).toMatch(/Wang Dan Test|王大拿的测试交流圈/);
  
  // Check header and footer
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
});
