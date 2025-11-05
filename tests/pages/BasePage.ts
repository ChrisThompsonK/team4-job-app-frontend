import { Page, Locator } from '@playwright/test';

/**
 * Base Page Class - Foundation for all page objects
 * Provides common methods and utilities used across all pages
 */
export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL path
     */
    async goto(path: string): Promise<void> {
        await this.page.goto(path);
    }

    /**
     * Get the current URL
     */
    getCurrentURL(): string {
        return this.page.url();
    }

    /**
     * Get the page title
     */
    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Wait for page to load
     */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Fill an input field
     */
    async fillInput(selector: string, text: string): Promise<void> {
        await this.page.locator(selector).fill(text);
    }

    /**
     * Click an element
     */
    async click(selector: string): Promise<void> {
        await this.page.locator(selector).click();
    }

    /**
     * Get text content of an element
     */
    async getText(selector: string): Promise<string> {
        return await this.page.locator(selector).textContent() || '';
    }

    /**
     * Wait for an element to be visible
     */
    async waitForElementVisible(selector: string, timeout: number = 5000): Promise<void> {
        await this.page.locator(selector).waitFor({ state: 'visible', timeout });
    }

    /**
     * Check if element is visible
     */
    async isElementVisible(selector: string): Promise<boolean> {
        try {
            return await this.page.locator(selector).isVisible({ timeout: 3000 });
        } catch {
            return false;
        }
    }

    /**
     * Take a screenshot
     */
    async takeScreenshot(path: string): Promise<void> {
        await this.page.screenshot({ path, fullPage: true });
    }

    /**
     * Verify page URL contains expected text
     */
    async verifyURLContains(expectedText: string): Promise<boolean> {
        return this.page.url().includes(expectedText);
    }
}
