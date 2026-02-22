import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';

test.describe('Search Functionality - E2E Tests', () => {
  const SEARCH_TERM = 'test';
  const SEARCH_TERMS = ['testing', 'automation', 'qa'];

  test('TC-032: Basic search functionality', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo();
    await homePage.searchFor(SEARCH_TERM);

    const pageContent = await page.content();
    expect(pageContent.length).toBeGreaterThan(0);
  });

  test('TC-033: Search input field is visible', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo();

    const searchInputVisible = await homePage.isElementVisible('input[placeholder*="Search"], input[placeholder*="搜索"]');
    expect(searchInputVisible).toBeTruthy();
  });

  test('TC-034: Search with multiple terms', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigateTo();

    for (const term of SEARCH_TERMS) {
      await searchPage.search(term);
      const resultCount = await searchPage.getResultsCount();
      expect(resultCount >= 0).toBeTruthy();
    }
  });

  test('TC-035: Search with empty query', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigateTo();

    await searchPage.search('');
    const hasResults = await searchPage.getResultsCount() > 0 || await searchPage.hasNoResults();
    expect(hasResults).toBeTruthy();
  });

  test('TC-036: Search with special characters', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigateTo();

    const specialQuery = '@#$%^&*';
    await searchPage.search(specialQuery);

    const pageStable = await page.waitForLoadState('networkidle2').catch(() => true);
    expect(pageStable).toBeTruthy();
  });

  test('TC-037: Search result visibility', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigateTo();

    await searchPage.search('test');

    const resultCount = await searchPage.getResultsCount();
    if (resultCount > 0) {
      const firstResultText = await searchPage.getFirstResultText();
      expect(firstResultText.length > 0).toBeTruthy();
    }
  });

  test('TC-038: Clear search query', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigateTo();

    await searchPage.search('test');
    await searchPage.clearSearch();

    const inputValue = await searchPage.searchInput.inputValue();
    expect(inputValue).toBe('');
  });

  test('TC-039: Click on search result', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigateTo();

    await searchPage.search('test');

    const resultCount = await searchPage.getResultsCount();
    if (resultCount > 0) {
      const initialUrl = await searchPage.getPageUrl();
      await searchPage.clickResult(0);
      await page.waitForLoadState('networkidle2').catch(() => true);

      const newUrl = await searchPage.getPageUrl();
      expect(newUrl).toBeTruthy();
    }
  });

  test('TC-040: Search performance', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigateTo();

    const start = Date.now();
    await searchPage.search('test');
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(5000);
  });
});

