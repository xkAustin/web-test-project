import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

const SEARCH_TERM = 'test';

test('TC-05 Search Functionality', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateTo();
  await homePage.searchFor(SEARCH_TERM);
  
  await expect(homePage.searchResults).toBeVisible();
  await expect(homePage.searchResults.locator('li')).toHaveCountGreaterThan(0);
});
