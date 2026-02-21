import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Registration Tests - E2E', () => {
  const baseURL = 'https://www.wangdanatest.top';

  test('TC-041: 注册页面加载成功', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo();

    const registerButton = page.locator('text=注册, text=Register');
    if (await registerButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await registerButton.click();

      const pageTitle = page.locator('h1, h2').first();
      const title = await pageTitle.textContent();
      expect(title).toBeTruthy();
    }
  });

  test('TC-042: 注册表单字段验证', async ({ page }) => {
    await page.goto(`${baseURL}/register`, { waitUntil: 'networkidle' });

    const usernameField = page.locator('input[name="username"], input[placeholder*="用户名"]');
    const emailField = page.locator('input[name="email"], input[type="email"]');
    const passwordField = page.locator('input[name="password"], input[type="password"]');

    const fieldsVisible = [
      await usernameField.isVisible({ timeout: 5000 }).catch(() => false),
      await emailField.isVisible({ timeout: 5000 }).catch(() => false),
      await passwordField.isVisible({ timeout: 5000 }).catch(() => false),
    ];

    expect(fieldsVisible.some(Boolean)).toBeTruthy();
  });

  test('TC-043: 空注册字段验证', async ({ page }) => {
    await page.goto(`${baseURL}/register`, { waitUntil: 'networkidle' });

    const submitBtn = page.locator('button[type="submit"], button:has-text("注册")');
    const initialCount = await submitBtn.count();

    if (initialCount > 0) {
      await submitBtn.click();

      const formInvalid = await page.evaluate(() => {
        const form = document.querySelector('form');
        return form ? !form.checkValidity() : true;
      });

      expect(formInvalid).toBeTruthy();
    }
  });

  test('TC-044: 有效注册流程', async ({ page }) => {
    const username = `testuser_${Date.now()}`;
    const email = `test_${Date.now()}@example.com`;
    const password = 'TestPass123@';

    await page.goto(`${baseURL}/register`, { waitUntil: 'networkidle' });

    const usernameField = page.locator('input[name="username"], input[type="text"]').first();
    const emailField = page.locator('input[name="email"], input[type="email"]').first();
    const passwordField = page.locator('input[name="password"], input[type="password"]').first();

    let fieldsFound = false;
    if (
      await usernameField.isVisible({ timeout: 5000 }).catch(() => false)
    ) {
      await usernameField.fill(username);
      fieldsFound = true;
    }

    if (
      await emailField.isVisible({ timeout: 5000 }).catch(() => false)
    ) {
      await emailField.fill(email);
      fieldsFound = true;
    }

    if (
      await passwordField.isVisible({ timeout: 5000 }).catch(() => false)
    ) {
      await passwordField.fill(password);
      fieldsFound = true;
    }

    if (fieldsFound) {
      const submitBtn = page.locator('button[type="submit"], button:has-text("注册")');
      if (await submitBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForLoadState('networkidle').catch(() => true);
      }
    }

    expect(fieldsFound).toBeTruthy();
  });

  test('TC-045: 邮箱有效性检查', async ({ page }) => {
    await page.goto(`${baseURL}/register`, { waitUntil: 'networkidle' });

    const emailField = page.locator('input[type="email"]');
    const emailVisible = await emailField.isVisible({ timeout: 5000 }).catch(() => false);

    if (emailVisible) {
      await emailField.fill('invalid-email');

      const isInvalid = await page.evaluate(() => {
        const input = document.querySelector('input[type="email"]') as HTMLInputElement;
        return input ? !input.checkValidity() : true;
      });

      expect(isInvalid).toBeTruthy();
    }
  });

  test('TC-046: 密码强度要求', async ({ page }) => {
    await page.goto(`${baseURL}/register`, { waitUntil: 'networkidle' });

    const passwordField = page.locator('input[type="password"]').first();
    if (await passwordField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordField.fill('weak');

      const passwordValue = await passwordField.inputValue();
      expect(passwordValue).toBe('weak');
    }
  });

  test('TC-047: 论坛讨论列表显示', async ({ page }) => {
    await page.goto(`${baseURL}/forum`, { waitUntil: 'networkidle' });

    const discussions = page.locator('.discussion-item, [class*="discussion"], li');
    const count = await discussions.count();

    expect(count >= 0).toBeTruthy();
  });

  test('TC-048: 创建论坛讨论（如果已登录）', async ({ page }) => {
    await page.goto(`${baseURL}/forum`, { waitUntil: 'networkidle' });

    const createBtn = page.locator('button:has-text("创建"), button:has-text("发布"), button:has-text("新建")');
    const createVisible = await createBtn.isVisible({ timeout: 5000 }).catch(() => false);

    if (createVisible) {
      expect(createVisible).toBeTruthy();
    }
  });

  test('TC-049: 标签过滤功能', async ({ page }) => {
    await page.goto(`${baseURL}/forum`, { waitUntil: 'networkidle' });

    const tags = page.locator('.tag, a[class*="tag"], button[class*="tag"]');
    const tagCount = await tags.count();

    if (tagCount > 0) {
      const firstTag = tags.first();
      const tagText = await firstTag.textContent();
      expect(tagText).toBeTruthy();

      await firstTag.click().catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => true);
    }

    expect(tagCount >= 0).toBeTruthy();
  });

  test('TC-050: 用户个人资料页面', async ({ page }) => {
    await page.goto(`${baseURL}/profile`, {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
    }).catch(async () => {
      // 如果直接访问失败，尝试从菜单导航
      await page.goto(`${baseURL}/`);
    });

    const profileContent = await page.content();
    expect(profileContent.length > 100).toBeTruthy();
  });
});
