import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchResults: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;
  readonly forumLink: Locator;
  readonly discussionList: Locator;
  readonly tagsList: Locator;
  readonly categoryList: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    this.searchResults = page.locator('.search-results, [class*="results"]');
    this.loginButton = page.locator('text=登录, text=Login');
    this.registerButton = page.locator('text=注册, text=Register');
    this.forumLink = page.locator('a[href*="forum"], a:has-text("论坛")');
    this.discussionList = page.locator('.discussion-item, [class*="discussion"]');
    this.tagsList = page.locator('.tags, [class*="tag"]');
    this.categoryList = page.locator('.category, [class*="category"]');
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle2');
  }

  async goToLogin() {
    await this.loginButton.click();
  }

  async goToRegister() {
    await this.registerButton.click();
  }

  async goToForum() {
    await this.forumLink.click();
    await this.page.waitForLoadState('networkidle2');
  }

  async getDiscussionCount(): Promise<number> {
    return await this.discussionList.count();
  }

  async clickDiscussion(index: number) {
    await this.discussionList.nth(index).click();
  }

  async getFirstDiscussionTitle(): Promise<string> {
    return await this.discussionList.first().textContent() || '';
  }

  async clickTag(tagName: string) {
    await this.page.locator(`a:has-text("${tagName}")`).click();
  }

  async getTagsCount(): Promise<number> {
    return await this.tagsList.count();
  }

  async clickCategory(categoryName: string) {
    await this.page.locator(`a:has-text("${categoryName}")`).click();
  }
}
