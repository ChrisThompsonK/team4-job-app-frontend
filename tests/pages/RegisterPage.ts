import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Register Page Object Model
 * Encapsulates all elements and interactions for the registration page
 */
export class RegisterPage extends BasePage {
    // Selectors
    readonly firstNameInput = 'input[name="firstName"]';
    readonly lastNameInput = 'input[name="lastName"]';
    readonly emailInput = 'input[name="email"]';
    readonly passwordInput = 'input[name="password"]';
    readonly confirmPasswordInput = 'input[name="confirmPassword"]';
    readonly createAccountButton = 'button:has-text("Create Account")';
    readonly loginLink = 'a:has-text("Sign in")';
    readonly errorMessage = '[class*="error"]';
    readonly successMessage = '[class*="success"]';
    readonly pageTitle = 'h1:has-text("Create Account")';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to register page
     */
    async navigateToRegister(): Promise<void> {
        await this.goto('/register');
        await this.waitForPageLoad();
    }

    /**
     * Fill first name field
     */
    async enterFirstName(firstName: string): Promise<void> {
        await this.fillInput(this.firstNameInput, firstName);
    }

    /**
     * Fill last name field
     */
    async enterLastName(lastName: string): Promise<void> {
        await this.fillInput(this.lastNameInput, lastName);
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
     * Fill confirm password field
     */
    async enterConfirmPassword(confirmPassword: string): Promise<void> {
        await this.fillInput(this.confirmPasswordInput, confirmPassword);
    }

    /**
     * Click create account button
     */
    async clickCreateAccountButton(): Promise<void> {
        await this.click(this.createAccountButton);
        await this.waitForPageLoad();
    }

    /**
     * Perform complete registration
     */
    async register(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        confirmPassword: string
    ): Promise<void> {
        await this.navigateToRegister();
        await this.enterFirstName(firstName);
        await this.enterLastName(lastName);
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.enterConfirmPassword(confirmPassword);
        await this.clickCreateAccountButton();
    }

    /**
     * Click login link to navigate to login
     */
    async clickLoginLink(): Promise<void> {
        await this.click(this.loginLink);
        await this.waitForPageLoad();
    }

    /**
     * Verify register page is displayed
     */
    async isRegisterPageDisplayed(): Promise<boolean> {
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
}
