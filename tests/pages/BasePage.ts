import type { Page, Locator } from "@playwright/test";

/**
 * Base Page Object - Contains common functionality for all pages
 */
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string = "/") {
    await this.page.goto(`http://localhost:3000${path}`);
  }

  async getPageTitle() {
    return this.page.title();
  }

  async getCurrentUrl() {
    return this.page.url();
  }
}
