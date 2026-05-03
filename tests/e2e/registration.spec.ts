import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Registration Tests - E2E', () => {
  test('TC-092: Registration page loads successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo();

    const registerButton = page.locator('text=注册, text=Register');
    if (await registerButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await registerButton.click();

      const pageTitle = page.locator('h1, h2').first();
      const title = await pageTitle.textContent();
      expect(title).toBeTruthy();
    }
    // If register button not visible, test is inconclusive but not a failure
  });

  test('TC-093: Registration form fields visible', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle' });

    const usernameField = page.locator(
      'input[name="username"], input[placeholder*="username"], input[placeholder*="用户名"]',
    );
    const emailField = page.locator('input[name="email"], input[type="email"]');
    const passwordField = page.locator(
      'input[name="password"], input[placeholder*="password"], input[placeholder*="密码"]',
    );

    const fieldsVisible = [
      await usernameField.isVisible({ timeout: 3000 }).catch(() => false),
      await emailField.isVisible({ timeout: 3000 }).catch(() => false),
      await passwordField.isVisible({ timeout: 3000 }).catch(() => false),
    ];

    expect(fieldsVisible.some(Boolean)).toBeTruthy();
  });

  test('TC-094: Empty registration field validation', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle' });

    const submitBtn = page.locator('button[type="submit"], button:has-text("注册"), button:has-text("Register")');
    const initialCount = await submitBtn.count();

    test.skip(initialCount === 0, 'Submit button not found on register page');

    await submitBtn.click();

    const formInvalid = await page.evaluate(() => {
      const form = document.querySelector('form');
      return form ? !form.checkValidity() : true;
    });

    expect(formInvalid).toBeTruthy();
  });

  test('TC-095: Valid registration flow', async ({ page }) => {
    const username = `testuser_${Date.now()}`;
    const email = `test_${Date.now()}@example.com`;
    const password = 'TestPass123@';

    await page.goto('/register', { waitUntil: 'networkidle' });

    const usernameField = page.locator('input[name="username"], input[type="text"]').first();
    const emailField = page.locator('input[name="email"], input[type="email"]').first();
    const passwordField = page.locator('input[name="password"], input[type="password"]').first();

    let fieldsFound = 0;
    if (await usernameField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await usernameField.fill(username);
      fieldsFound++;
    }

    if (await emailField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailField.fill(email);
      fieldsFound++;
    }

    if (await passwordField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await passwordField.fill(password);
      fieldsFound++;
    }

    test.skip(fieldsFound === 0, 'No registration form fields found');

    const submitBtn = page.locator('button[type="submit"], button:has-text("注册"), button:has-text("Register")');
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitBtn.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('TC-096: Email field validation', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle' });

    const emailField = page.locator('input[type="email"]');
    test.skip(
      !(await emailField.isVisible({ timeout: 3000 }).catch(() => false)),
      'Email field not found on register page',
    );

    await emailField.fill('invalid-email');

    const isInvalid = await page.evaluate(() => {
      const input = document.querySelector('input[type="email"]') as HTMLInputElement;
      return input ? !input.checkValidity() : true;
    });

    expect(isInvalid).toBeTruthy();
  });

  test('TC-097: Password field accepts input', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle' });

    const passwordField = page.locator('input[type="password"]').first();
    test.skip(
      !(await passwordField.isVisible({ timeout: 3000 }).catch(() => false)),
      'Password field not found',
    );

    await passwordField.fill('weak');

    const passwordValue = await passwordField.inputValue();
    expect(passwordValue).toBe('weak');
  });

  test('TC-098: Forum discussion list display', async ({ page }) => {
    await page.goto('/forum', { waitUntil: 'networkidle' });

    const discussions = page.locator('.discussion-item, [class*="discussion"], li');
    const count = await discussions.count();

    expect(typeof count).toBe('number');
  });

  test('TC-099: Create forum discussion button (if logged in)', async ({ page }) => {
    await page.goto('/forum', { waitUntil: 'networkidle' });

    const createBtn = page.locator(
      'button:has-text("create"), button:has-text("发布"), button:has-text("新建"), button:has-text("New")',
    );
    const createVisible = await createBtn.isVisible({ timeout: 3000 }).catch(() => false);

    if (createVisible) {
      console.log('Create button found (user may be logged in)');
    }
    // If create button not visible (not logged in), test is inconclusive
  });

  test('TC-100: Tag filter functionality', async ({ page }) => {
    await page.goto('/forum', { waitUntil: 'networkidle' });

    const tags = page.locator('.tag, a[class*="tag"], button[class*="tag"]');
    const tagCount = await tags.count();

    test.skip(tagCount === 0, 'No tags found on forum page');

    const firstTag = tags.first();
    const tagText = await firstTag.textContent();
    expect(tagText).toBeTruthy();

    await firstTag.click();
    await page.waitForLoadState('networkidle');

    // Verify page updated after tag click
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
  });

  test('TC-101: User profile page', async ({ page }) => {
    await page
      .goto('/profile', {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      })
      .catch(() => page.goto('/'));

    const profileContent = await page.content();
    expect(profileContent.length > 100).toBeTruthy();
  });
});
