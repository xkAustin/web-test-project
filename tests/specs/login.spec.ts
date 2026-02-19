import { test, expect } from '@playwright/test';

import { TEST_USER } from '../config';\n\nconst VALID_USER = TEST_USER;
const INVALID_PASSWORD = 'wrongpass';

test('TC-03 Login – Valid Credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="username"]', VALID_USER.username);
  await page.fill('input[name="password"]', VALID_USER.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator('text=Welcome')).toContainText(VALID_USER.username);
});

test('TC-04 Login – Invalid Credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="username"]', VALID_USER.username);
  await page.fill('input[name="password"]', INVALID_PASSWORD);
  await page.click('button[type="submit"]');
  await expect(page.locator('.toast')).toContainText('Invalid credentials');
});
