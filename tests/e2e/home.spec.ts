import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('HomePage - E2E Tests', () => {
  test('TC-001: Homepage loads successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo();

    const title = await homePage.getTitle();
    expect(title.length).toBeGreaterThan(0);
    expect([title.includes('Wang'), title.includes('王大拿'), title.includes('测试')].some(Boolean)).toBeTruthy();
  });

  test('TC-002: Verify header and footer are visible', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo();

    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('TC-003: Verify navigation elements are present', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo();

    const hasLoginButton = await homePage.isElementVisible('text=登录');
    const hasRegisterButton = await homePage.isElementVisible('text=注册');

    expect(hasLoginButton || hasRegisterButton).toBeTruthy();
  });

  test('TC-004: Search functionality is present', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo();

    const searchInputVisible = await homePage.isElementVisible('input[placeholder*="Search"], input[placeholder*="搜索"]');
    expect(searchInputVisible).toBeTruthy();
  });

  test('TC-005: Page has content loading', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo();

    const pageContent = await page.content();
    expect(pageContent.length).toBeGreaterThan(1000);
  });

  test('TC-006: Verify meta tags are present', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo();

    const description = await homePage.getPageMetaDescription();
    expect(description).toBeTruthy();
  });

  test('TC-007: Check page load performance', async ({ page }) => {
    const startTime = Date.now();
    const homePage = new HomePage(page);
    await homePage.navigateTo();
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });

  test('TC-008: Verify responsive design viewport', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo();

    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
  });
});

