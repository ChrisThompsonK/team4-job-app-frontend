import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Login Page Object - Represents the user login page
 */
export class LoginPage extends BasePage {
  readonly welcomeBackHeading: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly submitButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeBackHeading = page.getByRole("heading", { name: "Welcome Back" });
    this.emailField = page.locator('#email');
    this.passwordField = page.locator('#password');
    this.submitButton = page.getByRole("button", { name: /Login/i });
    this.logoutButton = page.getByRole("button", { name: /Logout/i });
  }

  async open() {
    await this.goto("/login");
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async verifyHeading() {
    await expect(this.welcomeBackHeading).toBeVisible();
  }

  async verifyFormFields() {
    await expect(this.page.getByLabel(/Email/i)).toBeVisible();
    await expect(this.page.getByLabel(/Password/i).first()).toBeVisible();
  }

  generateUniqueEmail(): string {
    const timestamp = Date.now();
    return `testuser${timestamp}@example.com`;
  }

  async fillLoginForm(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async verifyUnsuccessfulRegistration(baseUrl: string) {
    const currentUrl = await this.getCurrentUrl();
    const isNotsuccess = 
      currentUrl.includes("error=invalid-credentials");
    
    expect(isNotsuccess).toBeTruthy();
  }

  async verifySuccessfulRegistration(baseUrl: string) {
    const currentUrl = await this.getCurrentUrl();
    const isSuccess = 
      currentUrl.includes("success=login");
    
    expect(isSuccess).toBeTruthy();
  }

  async waitForNavigation(timeout: number = 10000) {
    await this.page.waitForURL(/\/(.*)?/, { timeout });
  }

  async logout() {
       await this.logoutButton.click();
  }

  async verifySuccessfulLogout(baseURL: string) {
        const currentUrl = await this.getCurrentUrl();
    const isSuccess = 
      currentUrl.includes("login?success=logout");
    
    expect(isSuccess).toBeTruthy();
  }
}
