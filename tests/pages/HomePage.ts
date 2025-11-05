import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object Model
 * Encapsulates all elements and interactions for the home/index page
 */
export class HomePage extends BasePage {
    // Selectors
    readonly pageHeading = 'h1, h2';
    readonly jobCards = '[class*="card"], [role="article"]';
    readonly jobsLink = 'a:has-text("Jobs")';
    readonly profileLink = 'a:has-text("Profile")';
    readonly logoutButton = 'button:has-text("Logout")';
    readonly loginLink = 'a:has-text("Login"), a:has-text("Sign in")';
    readonly registerLink = 'a:has-text("Register"), a:has-text("Sign up")';
    readonly navbar = 'nav, header';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to home page
     */
    async navigateToHome(): Promise<void> {
        await this.goto('/');
        await this.waitForPageLoad();
    }

    /**
     * Click on Jobs link in navigation
     */
    async clickJobsLink(): Promise<void> {
        await this.click(this.jobsLink);
        await this.waitForPageLoad();
    }

    /**
     * Click on Profile link in navigation
     */
    async clickProfileLink(): Promise<void> {
        if (await this.isElementVisible(this.profileLink)) {
            await this.click(this.profileLink);
            await this.waitForPageLoad();
        }
    }

    /**
     * Click logout button
     */
    async clickLogout(): Promise<void> {
        if (await this.isElementVisible(this.logoutButton)) {
            await this.click(this.logoutButton);
            await this.waitForPageLoad();
        }
    }

    /**
     * Click login link
     */
    async clickLoginLink(): Promise<void> {
        if (await this.isElementVisible(this.loginLink)) {
            await this.click(this.loginLink);
            await this.waitForPageLoad();
        }
    }

    /**
     * Click register link
     */
    async clickRegisterLink(): Promise<void> {
        if (await this.isElementVisible(this.registerLink)) {
            await this.click(this.registerLink);
            await this.waitForPageLoad();
        }
    }

    /**
     * Get number of job cards displayed on home page
     */
    async getJobCardsCount(): Promise<number> {
        return await this.page.locator(this.jobCards).count();
    }

    /**
     * Check if home page is displayed (navbar visible)
     */
    async isHomePageDisplayed(): Promise<boolean> {
        return await this.isElementVisible(this.navbar);
    }

    /**
     * Check if user is logged in (logout button visible)
     */
    async isUserLoggedIn(): Promise<boolean> {
        return await this.isElementVisible(this.logoutButton);
    }

    /**
     * Check if user is not logged in (login link visible)
     */
    async isUserLoggedOut(): Promise<boolean> {
        return await this.isElementVisible(this.loginLink);
    }

    /**
     * Get page heading text
     */
    async getPageHeadingText(): Promise<string> {
        return await this.getText(this.pageHeading);
    }
}
