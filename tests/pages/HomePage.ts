import { expect, type Locator, type Page } from "@playwright/test";
import { TEST_TIMEOUTS } from "../constants";
import { BasePage } from "./BasePage";

/**
 * Home Page Object - Represents the homepage of the Kainos Job Portal
 */
export class HomePage extends BasePage {
  // Locators
  readonly kainosLogo: Locator;
  readonly homeLink: Locator;
  readonly jobsLink: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly heroSection: Locator;
  readonly latestJobsHeading: Locator;
  readonly exploreJobsButton: Locator;
  readonly jobCards: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.kainosLogo = page.locator('img[alt*="Kainos"]').first();
    this.homeLink = page.getByRole("link", { name: "Home" });
    this.jobsLink = page.getByRole("link", { name: "Jobs", exact: true }).first();
    this.loginLink = page.getByRole("link", { name: "Login", exact: true }).first();
    this.registerLink = page.getByRole("link", { name: /Register|Sign Up/i });

    // Content
    this.heroSection = page.getByText(/Find Your Next Career Opportunity/i);
    this.latestJobsHeading = page.getByRole("heading", { name: /Latest Job Opportunities/i });
    this.exploreJobsButton = page.getByRole("link", { name: "🔍 Explore Jobs" });
    this.jobCards = page.locator("h3");
  }

  async open() {
    await this.goto("/");
  }

  async verifyPageTitle() {
    await expect(this.page).toHaveTitle(/Kainos Job Portal/);
  }

  async verifyLogoIsVisible() {
    await expect(this.kainosLogo).toBeVisible();
  }

  async verifyNavigationMenu() {
    await expect(this.homeLink).toBeVisible();
    await expect(this.jobsLink).toBeVisible();
    await expect(this.loginLink).toBeVisible();
  }

  async verifyHeroSection() {
    await expect(this.heroSection).toBeVisible();
  }

  async verifyLatestJobsSection() {
    await expect(this.latestJobsHeading).toBeVisible();
  }

  async verifyExploreJobsButton() {
    await expect(this.exploreJobsButton).toBeVisible();
  }

  async clickExploreJobs() {
    await this.exploreJobsButton.click();
  }

  async navigateToRegister() {
    // Click Login link from homepage
    await this.loginLink.click();

    // Wait for navigation to login page
    await this.page.waitForURL("**/login");

    // Click Sign Up link on login page
    const signUpLink = this.page.getByRole("link", { name: /Sign Up|Register/i });
    await signUpLink.click();

    // Verify we're on the register page
    await this.page.waitForURL("**/register");
    await expect(this.page).toHaveURL(/\/register/);
  }

  async waitForJobCards() {
    await this.page.waitForSelector("h3", { timeout: TEST_TIMEOUTS.DEFAULT });
  }

  async getJobDetailLinks(): Promise<string[]> {
    return await this.page.locator('a[href^="/jobs/"]').evaluateAll((links) =>
      links
        .filter((link) => {
          const href = link.getAttribute("href");
          return href && /^\/jobs\/\d+$/.test(href);
        })
        .map((link) => link.getAttribute("href") as string)
    );
  }

  async clickFirstJobDetailLink(jobLinks: string[]) {
    if (jobLinks.length > 0) {
      await this.page.click(`a[href="${jobLinks[0]}"]`);
    }
  }

  async verifyJobCardsVisible() {
    await expect(this.jobCards.first()).toBeVisible();
  }
}
