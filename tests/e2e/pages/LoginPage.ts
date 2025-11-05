import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Login page
 * Encapsulates all login-related selectors and actions
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly signUpLink: Locator;
  readonly welcomeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    // Form inputs
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    // Buttons
    this.loginButton = page.locator('button:has-text("Login")');
    // Messages
    this.errorMessage = page.locator('[role="alert"]:has-text("Error")');
    this.successMessage = page.locator('[role="alert"]:has-text("Success")');
    // Links
    this.signUpLink = page.locator('a:has-text("Sign up")');
    // Headers
    this.welcomeHeader = page.locator('h1:has-text("Welcome Back")');
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('/login');
  }

  /**
   * Verify that the login page is loaded
   */
  async isLoaded() {
    await this.welcomeHeader.waitFor({ state: 'visible' });
  }

  /**
   * Perform a login action with email and password
   * @param email - The email address to login with
   * @param password - The password to login with
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Get the error message text if it exists
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await this.errorMessage.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Get the success message text if it exists
   */
  async getSuccessMessage(): Promise<string | null> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await this.successMessage.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Check if the login page is displayed (useful for verifying failed redirects)
   */
  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes('/login');
  }

  /**
   * Navigate to the sign up page by clicking the sign up link
   */
  async goToSignUp() {
    await this.signUpLink.click();
    await this.page.waitForURL('/register');
  }
}
