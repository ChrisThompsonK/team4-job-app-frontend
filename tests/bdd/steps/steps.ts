import { Given, When, Then, Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium, expect } from "@playwright/test";

setDefaultTimeout(30 * 1000);

interface TestContext {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
}

const world: TestContext = {};

Before(async function () {
  world.browser = await chromium.launch();
  world.context = await world.browser.newContext();
  world.page = await world.context.newPage();
});

After(async function () {
  if (world.context) {
    await world.context.close();
  }
  if (world.browser) {
    await world.browser.close();
  }
});

// Login Page Steps
Given("I am on the login page", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.goto("http://localhost:3000/login");
  await world.page.waitForLoadState("networkidle");
});

When("I enter {string} as email", async function (email: string) {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.fill('input[name="email"]', email);
});

When("I enter {string} as password", async function (password: string) {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.fill('input[name="password"]', password);
});

When("I click the login button", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.click('button:has-text("Login")');
  await world.page.waitForLoadState("networkidle");
});

Then("I should be logged in successfully", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  const url = world.page.url();
  const isStillOnLogin = url.includes("/login");
  expect(isStillOnLogin).toBe(false);
});

Then("I should see an error message", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  const errorMessage = world.page.locator('[role="alert"]:has-text("Error")');
  await expect(errorMessage).toBeVisible({ timeout: 5000 });
});

// Job Pages Steps
Given("I am on the home page", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.goto("http://localhost:3000");
  await world.page.waitForLoadState("networkidle");
});

Given("I am on the jobs page", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.goto("http://localhost:3000/jobs");
  await world.page.waitForLoadState("networkidle");
});

When("I click on {string}", async function (text: string) {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.click(`button:has-text("${text}"), a:has-text("${text}")`);
});

When("I click on the first job", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  const firstJobLink = world.page.locator('a[href*="/jobs/"]').first();
  await firstJobLink.click();
  await world.page.waitForLoadState("networkidle");
});

Then("I should see a list of jobs", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  const jobsContainer = world.page
    .locator("main, .jobs-container, [data-testid='jobs-list']")
    .first();
  await expect(jobsContainer).toBeVisible();
});

Then("I should see the job details", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  const jobDetailsContainer = world.page
    .locator("main, .job-detail, [data-testid='job-details']")
    .first();
  await expect(jobDetailsContainer).toBeVisible();
});

// Create Job Steps
Given("I am on the create job page", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.goto("http://localhost:3000/jobs/create");
  await world.page.waitForLoadState("networkidle");
});

When("I navigate to create job page", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.click('a:has-text("Create Job"), button:has-text("Create Job")');
  await world.page.waitForLoadState("networkidle");
});

When("I fill in the job form with valid data", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.fill('input[name="name"]', "Senior Software Engineer");
  await world.page.fill('input[name="location"]', "London");
  await world.page.fill('select[name="capability"]', "Cloud Services");
  await world.page.fill('select[name="band"]', "Band 3");
  await world.page.fill('input[name="closingDate"]', "2025-12-31");
  await world.page.fill('textarea[name="summary"]', "We are looking for an experienced engineer");
  await world.page.fill('textarea[name="keyResponsibilities"]', "Lead technical projects");
  await world.page.fill('input[name="numberOfOpenPositions"]', "2");
});

When("I submit the job form", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.click('button:has-text("Create"), button[type="submit"]');
  await world.page.waitForLoadState("networkidle");
});

When("I submit the job form without filling required fields", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.click('button:has-text("Create"), button[type="submit"]');
  await world.page.waitForLoadState("networkidle");
});

Then("I should see job creation success message", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  const successMessage = world.page.locator('[role="alert"]:has-text("Success"), .success-message');
  await expect(successMessage).toBeVisible({ timeout: 5000 });
});

Then("I should see validation error messages", async function () {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  const errorMessages = world.page.locator('[role="alert"]:has-text("Error"), .error-message');
  await expect(errorMessages.first()).toBeVisible({ timeout: 5000 });
});

// Data-Driven Authentication Steps
Then("the login result should be {string}", async function (expected: string) {
  if (!world.page) {
    throw new Error("Page not initialized");
  }
  await world.page.waitForLoadState("networkidle");

  const url = world.page.url();
  const isStillOnLogin = url.includes("/login");
  const errorMessage = world.page.locator('[role="alert"]:has-text("Error")');
  const errorExists = await errorMessage.isVisible().catch(() => false);

  if (expected === "success") {
    expect(isStillOnLogin).toBe(false);
  } else if (expected === "error") {
    expect(isStillOnLogin || errorExists).toBe(true);
  }
});
