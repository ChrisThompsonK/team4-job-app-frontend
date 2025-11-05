import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Jobs Listing Page Object Model
 * Encapsulates all elements and interactions for the jobs listing page
 */
export class JobsPage extends BasePage {
    // Selectors
    readonly pageHeading = 'h1, h2';
    readonly jobItems = '[class*="job"], [role="article"]';
    readonly searchInput = 'input[type="search"], input[placeholder*="Search"]';
    readonly locationFilter = 'select[name="location"], select';
    readonly capabilityFilter = 'select[name="capability"], select';
    readonly nextButton = 'button:has-text("Next"), a[href*="page=2"], [aria-label*="Next"]';
    readonly previousButton = 'button:has-text("Previous"), [aria-label*="Previous"]';
    readonly applyButton = 'button:has-text("Apply"), a:has-text("Apply")';
    readonly viewDetailsButton = 'button:has-text("View"), a:has-text("Details")';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to jobs page
     */
    async navigateToJobs(): Promise<void> {
        await this.goto('/jobs');
        await this.waitForPageLoad();
    }

    /**
     * Search for jobs by keyword
     */
    async searchForJobs(keyword: string): Promise<void> {
        const searchField = this.page.locator(this.searchInput).first();
        if (await searchField.isVisible()) {
            await searchField.fill(keyword);
            await this.page.keyboard.press('Enter');
            await this.waitForPageLoad();
        }
    }

    /**
     * Filter jobs by location
     */
    async filterByLocation(locationIndex: number): Promise<void> {
        const locationFilterField = this.page.locator(this.locationFilter).first();
        if (await locationFilterField.isVisible()) {
            await locationFilterField.selectOption({ index: locationIndex });
            await this.waitForPageLoad();
        }
    }

    /**
     * Filter jobs by capability
     */
    async filterByCapability(capabilityIndex: number): Promise<void> {
        const capabilityFilterField = this.page.locator(this.capabilityFilter).nth(1);
        if (await capabilityFilterField.isVisible()) {
            await capabilityFilterField.selectOption({ index: capabilityIndex });
            await this.waitForPageLoad();
        }
    }

    /**
     * Get number of job items displayed
     */
    async getJobItemsCount(): Promise<number> {
        return await this.page.locator(this.jobItems).count();
    }

    /**
     * Click on first job to view details
     */
    async clickFirstJob(): Promise<void> {
        const firstJob = this.page.locator(this.jobItems).first();
        if (await firstJob.isVisible()) {
            await firstJob.click();
            await this.waitForPageLoad();
        }
    }

    /**
     * Click on job at specific index
     */
    async clickJobAtIndex(index: number): Promise<void> {
        const jobs = this.page.locator(this.jobItems);
        if (await jobs.nth(index).isVisible()) {
            await jobs.nth(index).click();
            await this.waitForPageLoad();
        }
    }

    /**
     * Click next button for pagination
     */
    async clickNextButton(): Promise<void> {
        const nextBtn = this.page.locator(this.nextButton).first();
        if (await nextBtn.isVisible()) {
            await nextBtn.click();
            await this.waitForPageLoad();
        }
    }

    /**
     * Click previous button for pagination
     */
    async clickPreviousButton(): Promise<void> {
        const prevBtn = this.page.locator(this.previousButton).first();
        if (await prevBtn.isVisible()) {
            await prevBtn.click();
            await this.waitForPageLoad();
        }
    }

    /**
     * Check if jobs page is displayed
     */
    async isJobsPageDisplayed(): Promise<boolean> {
        return await this.isElementVisible(this.jobItems);
    }

    /**
     * Check if next button is available
     */
    async hasNextButton(): Promise<boolean> {
        return await this.isElementVisible(this.nextButton);
    }

    /**
     * Check if previous button is available
     */
    async hasPreviousButton(): Promise<boolean> {
        return await this.isElementVisible(this.previousButton);
    }

    /**
     * Get all job titles from current page
     */
    async getJobTitles(): Promise<(string | null)[]> {
        const jobs = this.page.locator(this.jobItems);
        const count = await jobs.count();
        const titles: (string | null)[] = [];

        for (let i = 0; i < count; i++) {
            const title = await jobs.nth(i).textContent();
            titles.push(title);
        }

        return titles;
    }
}
