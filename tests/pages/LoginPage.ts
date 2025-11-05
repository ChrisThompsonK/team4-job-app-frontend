import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 * Encapsulates all elements and interactions for the login page
 */
export class LoginPage extends BasePage {
    // Selectors
    readonly emailInput = 'input[name="email"]';
    readonly passwordInput = 'input[name="password"]';
    readonly loginButton = 'button:has-text("Login")';
    readonly signUpLink = 'a:has-text("Sign up")';
    readonly errorMessage = '[class*="error"]';
    readonly successMessage = '[class*="success"]';
    readonly pageTitle = 'h1:has-text("Welcome Back")';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to login page
     */
    async navigateToLogin(): Promise<void> {
        await this.goto('/login');
        await this.waitForPageLoad();
    }

    /**
     * Fill email field
     */
    async enterEmail(email: string): Promise<void> {
        await this.fillInput(this.emailInput, email);
    }

    /**
     * Fill password field
     */
    async enterPassword(password: string): Promise<void> {
        await this.fillInput(this.passwordInput, password);
    }

    /**
     * Click login button
     */
    async clickLoginButton(): Promise<void> {
        await this.click(this.loginButton);
        await this.waitForPageLoad();
    }

    /**
     * Perform complete login action
     */
    async login(email: string, password: string): Promise<void> {
        await this.navigateToLogin();
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    /**
     * Click sign up link to navigate to register
     */
    async clickSignUpLink(): Promise<void> {
        await this.click(this.signUpLink);
        await this.waitForPageLoad();
    }

    /**
     * Verify login page is displayed
     */
    async isLoginPageDisplayed(): Promise<boolean> {
        return await this.isElementVisible(this.pageTitle);
    }

    /**
     * Get error message if present
     */
    async getErrorMessage(): Promise<string> {
        if (await this.isElementVisible(this.errorMessage)) {
            return await this.getText(this.errorMessage);
        }
        return '';
    }

    /**
     * Check if email input is visible
     */
    async isEmailInputVisible(): Promise<boolean> {
        return await this.isElementVisible(this.emailInput);
    }

    /**
     * Check if password input is visible
     */
    async isPasswordInputVisible(): Promise<boolean> {
        return await this.isElementVisible(this.passwordInput);
    }
}
