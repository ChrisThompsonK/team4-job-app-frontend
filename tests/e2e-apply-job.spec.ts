import { test, expect } from '@playwright/test';

test('User can view jobs and navigate to job details', async ({ page }) => {
  // Navigate to jobs page
  await page.goto('http://localhost:3000/jobs');

  // Verify the page loaded with job listings by checking for the "Available Job Roles" heading
  const jobsHeading = page.locator('text="Available Job Roles"');
  await expect(jobsHeading).toBeVisible();

  // Verify at least one "View Details" link exists
  const viewDetailsLinks = page.locator('a:has-text("View Details")');
  await expect(viewDetailsLinks.first()).toBeVisible();

  // Click on the first job card's "View Details" link
  await viewDetailsLinks.first().click();

  // Verify we navigated to the job detail page
  await expect(page).toHaveURL(/\/jobs\/\d+$/);

  // Verify the job detail page loads with job information
  await expect(page.locator('h1')).toBeVisible();

  // Verify the Apply button or Login link appears
  const applyOrLoginLink = page.locator('a[href*="/apply"], a[href*="/login"]').first();
  await expect(applyOrLoginLink).toBeVisible();
});

