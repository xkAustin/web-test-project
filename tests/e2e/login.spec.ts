import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_USER } from '../utils/config';

const VALID_USER = TEST_USER;
const INVALID_PASSWORD = 'wrongpass';

test('TC-03 Login – Valid Credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateTo('/login');
  await loginPage.login(VALID_USER.username, VALID_USER.password);
  
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator('text=Welcome')).toContainText(VALID_USER.username);
});

test('TC-04 Login – Invalid Credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateTo('/login');
  await loginPage.login(VALID_USER.username, INVALID_PASSWORD);
  
  await expect(loginPage.errorMessage).toContainText('Invalid credentials');
});
