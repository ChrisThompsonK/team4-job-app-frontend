import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Registration Page Object - Represents the user registration page
 */
export class RegistrationPage extends BasePage {
  // Locators
  readonly pageHeading: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly confirmPasswordField: Locator;
  readonly signInLink: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole("heading", {
      name: /Join Kainos|Register|Sign Up|Create Account/i,
    });
    this.firstNameField = page.locator("#firstName");
    this.lastNameField = page.locator("#lastName");
    this.emailField = page.locator("#email");
    this.passwordField = page.locator("#password");
    this.confirmPasswordField = page.locator("#confirmPassword");
    this.signInLink = page.getByRole("link", { name: /Sign in/i });
    this.submitButton = page.getByRole("button", {
      name: /Register|Sign Up|Create Account|Submit/i,
    });
  }

  async open() {
    await this.goto("/register");
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(/\/register/);
  }

  async verifyHeading() {
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyFormFields() {
    await expect(this.page.getByLabel(/First Name/i)).toBeVisible();
    await expect(this.page.getByLabel(/Last Name/i)).toBeVisible();
    await expect(this.page.getByLabel(/Email/i)).toBeVisible();
    await expect(this.page.getByLabel(/Password/i).first()).toBeVisible();
  }

  async verifySubmitButton() {
    await expect(this.submitButton).toBeVisible();
  }

  async fillRegistrationForm(firstName: string, lastName: string, email: string, password: string) {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.confirmPasswordField.fill(password);
  }

  async submitEmptyForm() {
    await this.page.getByRole("button", { name: "Create Account" }).click();
    await this.page.waitForTimeout(500);
  }

  async clickSignInLink() {
    await this.signInLink.click();
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async waitForNavigation(timeout: number = 10000) {
    await this.page.waitForURL(/\/(.*)?/, { timeout });
  }

  async verifySuccessfulRegistration(baseUrl: string) {
    const currentUrl = await this.getCurrentUrl();
    const isSuccess =
      currentUrl.includes("success=registration") ||
      currentUrl === `${baseUrl}/` ||
      currentUrl === baseUrl ||
      !currentUrl.includes("/register");

    expect(isSuccess).toBeTruthy();
  }

  generateUniqueEmail(): string {
    const timestamp = Date.now();
    return `testuser${timestamp}@example.com`;
  }
}
