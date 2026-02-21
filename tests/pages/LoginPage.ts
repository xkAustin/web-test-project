import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"], input[type="text"]').first();
    this.passwordInput = page.locator('input[name="password"], input[type="password"]');
    this.submitButton = page.locator('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    this.errorMessage = page.locator('[class*="toast"], [class*="error"], .alert-danger');
    this.forgotPasswordLink = page.locator('a:has-text("忘记密码"), a:has-text("Forgot Password")');
    this.registerLink = page.locator('a:has-text("注册"), a:has-text("Register")');
    this.rememberMeCheckbox = page.locator('input[type="checkbox"]');
    this.successMessage = page.locator('[class*="success"], .alert-success');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginWithRememberMe(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.rememberMeCheckbox.check();
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async goToForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async goToRegister() {
    await this.registerLink.click();
  }

  async clearForm() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}
