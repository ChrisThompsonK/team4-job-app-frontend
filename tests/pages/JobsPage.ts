import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Jobs Page Object - Represents the jobs listing page
 */
export class JobsPage extends BasePage {
  readonly availableJobsHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.availableJobsHeading = page.getByRole("heading", { name: "Available Job Roles" });
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(/\/jobs/);
  }

  async verifyHeading() {
    await expect(this.availableJobsHeading).toBeVisible();
  }
}
