import { test, expect } from '@playwright/test';
import { TEST_USER } from '../utils/config';

// 1. Login missing username
test('TC-Edge-01 Login without username', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  await expect(page.locator('.error')).toContainText('Username is required');
});

// 2. Login missing password
test('TC-Edge-02 Login without password', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="username"]', TEST_USER.username);
  await page.click('button[type="submit"]');
  await expect(page.locator('.error')).toContainText('Password is required');
});

// 3. Search with no results
test('TC-Edge-03 Search returns no results', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[placeholder="Search"]', 'unlikelysearchterm');
  await page.press('input[placeholder="Search"]', 'Enter');
  await expect(page.locator('.search-results')).toHaveText('No results found');
});

// 4. Navigation to 404 page
test('TC-Edge-04 Navigating to non-existent route shows 404', async ({ page }) => {
  await page.goto('/this-route-does-not-exist');
  await expect(page).toHaveURL(/\/this-route-does-not-exist$/);
  await expect(page.locator('h1')).toContainText('404');
});

// 5. Verify page title after navigation to About
test('TC-Edge-05 Page title after navigation', async ({ page }) => {
  await page.goto('/');
  await page.click('text=About');
  await expect(page).toHaveTitle(/About/);
});

// 6. Verify session cookie after login
test('TC-Edge-06 Session cookie set after login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="username"]', TEST_USER.username);
  await page.fill('input[name="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard$/);
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(c => c.name.toLowerCase().includes('session') || c.name.toLowerCase().includes('auth'));
  expect(sessionCookie).toBeDefined();
});
