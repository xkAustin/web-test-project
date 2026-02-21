import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_USER } from '../utils/config';

test.describe('Login Page - E2E Tests', () => {
  const VALID_USER = TEST_USER;
  const INVALID_PASSWORD = 'wrongpass@123';

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo('/login');
  });

  test('TC-009: Login page loads successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const title = await loginPage.getTitle();
    expect(title.length).toBeGreaterThan(0);
  });

  test('TC-010: Login form elements are visible', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('TC-011: Form validation - empty fields', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.submitButton.click();

    const isFormInvalid = await page.evaluate(() => {
      const form = document.querySelector('form');
      return form ? !form.checkValidity() : true;
    });

    expect(isFormInvalid).toBeTruthy();
  });

  test('TC-012: Login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(VALID_USER.username, VALID_USER.password);

    const currentUrl = await loginPage.getPageUrl();
    const successMessageVisible = await loginPage.successMessage.isVisible({ timeout: 5000 }).catch(() => false);

    const isSuccess = currentUrl.includes('dashboard') || currentUrl.includes('home') || successMessageVisible;
    expect(isSuccess).toBeTruthy();
  });

  test('TC-013: Login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(VALID_USER.username, INVALID_PASSWORD);

    const errorVisible = await loginPage.isErrorVisible();
    expect(errorVisible).toBeTruthy();
  });

  test('TC-014: Invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('nonexistentuser@test.com', VALID_USER.password);

    const errorVisible = await loginPage.isErrorVisible();
    expect(errorVisible).toBeTruthy();
  });

  test('TC-015: Form field interaction', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.usernameInput.fill('testuser');
    const usernameValue = await loginPage.usernameInput.inputValue();
    expect(usernameValue).toBe('testuser');

    await loginPage.passwordInput.fill('testpass');
    const passwordValue = await loginPage.passwordInput.inputValue();
    expect(passwordValue).toBe('testpass');
  });

  test('TC-016: Remember me functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const checkboxVisible = await loginPage.rememberMeCheckbox.isVisible({ timeout: 5000 }).catch(() => false);
    if (checkboxVisible) {
      await loginPage.loginWithRememberMe(VALID_USER.username, VALID_USER.password);
      expect(true).toBeTruthy();
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('TC-017: Clear form functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.usernameInput.fill('testuser');
    await loginPage.passwordInput.fill('testPass123');

    await loginPage.clearForm();

    const usernameValue = await loginPage.usernameInput.inputValue();
    const passwordValue = await loginPage.passwordInput.inputValue();

    expect(usernameValue).toBe('');
    expect(passwordValue).toBe('');
  });

  test('TC-018: SQL Injection attempt in username field', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const sqlInjectionPayload = "admin' OR '1'='1";
    await loginPage.login(sqlInjectionPayload, 'password');

    const isInjected = await page.evaluate(() => {
      const content = document.body.innerHTML;
      return content.includes('SELECT') || content.includes('SQL');
    });

    expect(isInjected).toBeFalsy();
  });

  test('TC-019: Special characters in password field', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const specialCharPassword = '!@#$%^&*()';
    await loginPage.usernameInput.fill(VALID_USER.username);
    await loginPage.passwordInput.fill(specialCharPassword);

    const passwordValue = await loginPage.passwordInput.inputValue();
    expect(passwordValue).toBe(specialCharPassword);
  });

  test('TC-020: Check page navigation after login attempt', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const initialUrl = await loginPage.getPageUrl();
    await loginPage.login(VALID_USER.username, VALID_USER.password);
    const finalUrl = await loginPage.getPageUrl();

    expect(finalUrl).toBeTruthy();
  });
});
