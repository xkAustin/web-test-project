import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResults: Locator;
  readonly resultItems: Locator;
  readonly noResultsMessage: Locator;
  readonly filterButton: Locator;
  readonly sortDropdown: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    this.searchButton = page.locator('button:has-text("Search"), button:has-text("搜索")');
    this.searchResults = page.locator('.search-results, [class*="results"]');
    this.resultItems = page.locator('.result-item, [class*="result"]');
    this.noResultsMessage = page.locator('text=No results, text=没有结果');
    this.filterButton = page.locator('button:has-text("Filter"), button:has-text("筛选")');
    this.sortDropdown = page.locator('select[name="sort"]');
    this.pagination = page.locator('.pagination');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getResultsCount(): Promise<number> {
    return await this.resultItems.count();
  }

  async getFirstResultText(): Promise<string> {
    return await this.resultItems.first().textContent() || '';
  }

  async clickResult(index: number): Promise<void> {
    await this.resultItems.nth(index).click();
  }

  async hasNoResults(): Promise<boolean> {
    return await this.noResultsMessage.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async applySorting(sortOption: string): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
    await this.page.waitForLoadState('networkidle');
  }

  async goToPage(pageNumber: number): Promise<void> {
    const pageLink = this.page.locator(`a:has-text("${pageNumber}")`);
    await pageLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  async getSearchSuggestions(): Promise<string[]> {
    const suggestions = await this.page.locator('[role="listbox"] > li, .suggestions > li');
    const count = await suggestions.count();
    const result: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await suggestions.nth(i).textContent();
      if (text) result.push(text);
    }

    return result;
  }
}
