import { Given, When, Then, After } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import { expect } from '@playwright/test';

let browser: Browser;
let page: Page;

Given('I am on the job listings page', async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:3000/jobs');
});

When('I view the available jobs', async () => {
  // The page is already loaded from the previous step
  await page.waitForLoadState('networkidle');
});

Then('I should see the "Available Job Roles" heading', async () => {
  const jobsHeading = page.locator('text="Available Job Roles"');
  await expect(jobsHeading).toBeVisible();
});

Then('I should see at least one "View Details" link', async () => {
  const viewDetailsLinks = page.locator('a:has-text("View Details")');
  await expect(viewDetailsLinks.first()).toBeVisible();
});

When('I click on the first "View Details" link', async () => {
  const viewDetailsLinks = page.locator('a:has-text("View Details")');
  await viewDetailsLinks.first().click();
});

Then('I should be navigated to the job detail page', async () => {
  await expect(page).toHaveURL(/\/jobs\/\d+$/);
});

Then('I should see the job information', async () => {
  const jobHeading = page.locator('h1').first();
  await expect(jobHeading).toBeVisible();
});

Then('I should see an apply or login link', async () => {
  const applyOrLoginLink = page.locator('a[href*="/apply"], a[href*="/login"]').first();
  await expect(applyOrLoginLink).toBeVisible();
});

After(async () => {
  if (browser) {
    await browser.close();
  }
});
