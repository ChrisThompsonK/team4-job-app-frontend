import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Job Detail Page Object - Represents a single job detail page
 */
export class JobDetailPage extends BasePage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator("h1, h2").first();
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(/\/jobs\/\d+/);
  }

  async verifyHeadingVisible() {
    await expect(this.heading).toBeVisible();
  }
}
