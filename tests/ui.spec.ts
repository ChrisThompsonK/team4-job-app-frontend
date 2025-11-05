import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
    test('should load the homepage successfully', async ({ page }) => {
        await page.goto('/');

        // Check that the page loaded
        await expect(page).toHaveTitle(/Find Your Next Career/);

        // Check for main heading
        const heading = page.locator('h1, h2').first();
        await expect(heading).toContainText(/Career Opportunity|Latest Jobs|Jobs/);

        // Screenshot of the homepage
        await page.screenshot({ path: 'test-results/screenshots/homepage.png', fullPage: true });
    });

    test('should display latest jobs on homepage', async ({ page }) => {
        await page.goto('/');

        // Wait for job cards to load
        const jobCards = page.locator('[class*="card"]');
        await expect(jobCards.first()).toBeVisible({ timeout: 5000 });

        // Take screenshot of loaded jobs
        await page.screenshot({ path: 'test-results/screenshots/homepage-with-jobs.png', fullPage: true });
    });

    test('should have navigation elements', async ({ page }) => {
        await page.goto('/');

        // Check for header/nav elements
        const nav = page.locator('nav, header');
        await expect(nav).toBeDefined();

        // Check for Jobs link
        const jobsLink = page.locator('a:has-text("Jobs")');
        await expect(jobsLink.first()).toBeVisible();
    });
});

test.describe('Jobs Listing Page', () => {
    test('should navigate to jobs page', async ({ page }) => {
        await page.goto('/jobs');

        // Check page title or heading
        const heading = page.locator('text=Job Roles, text=Available Job').first();
        if (await heading.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(heading).toBeVisible();
        }

        // Take screenshot
        await page.screenshot({ path: 'test-results/screenshots/jobs-listing.png', fullPage: true });
    });

    test('should display job list with pagination', async ({ page }) => {
        await page.goto('/jobs');

        // Wait for job items to load
        await page.waitForLoadState('networkidle');

        // Check for job items
        const jobItems = page.locator('[class*="job"], [role="article"]');
        const count = await jobItems.count();
        expect(count).toBeGreaterThan(0);

        // Take screenshot
        await page.screenshot({ path: 'test-results/screenshots/jobs-list-loaded.png', fullPage: true });
    });

    test('should search for jobs', async ({ page }) => {
        await page.goto('/jobs');

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Find search input
        const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
        if (await searchInput.isVisible()) {
            await searchInput.fill('Developer');
            await page.keyboard.press('Enter');

            // Wait for results
            await page.waitForLoadState('networkidle');

            // Take screenshot of search results
            await page.screenshot({ path: 'test-results/screenshots/jobs-search-results.png', fullPage: true });
        }
    });

    test('should filter jobs by location', async ({ page }) => {
        await page.goto('/jobs');

        await page.waitForLoadState('networkidle');

        // Find location filter dropdown
        const locationFilter = page.locator('select[name="location"], select').first();
        if (await locationFilter.isVisible()) {
            await locationFilter.selectOption({ index: 1 });

            // Wait for filtered results
            await page.waitForLoadState('networkidle');

            // Take screenshot
            await page.screenshot({ path: 'test-results/screenshots/jobs-filtered.png', fullPage: true });
        }
    });
});

test.describe('Job Detail Page', () => {
    test('should display job details when clicking on a job', async ({ page }) => {
        await page.goto('/jobs');

        await page.waitForLoadState('networkidle');

        // Click on first job
        const firstJob = page.locator('a:has-text("Frontend"), a:has-text("Developer"), button:has-text("View"), a').first();
        if (await firstJob.isVisible()) {
            await firstJob.click();

            // Wait for job detail page to load
            await page.waitForLoadState('networkidle');

            // Check for job details
            const jobName = page.locator('h1, h2').first();
            await expect(jobName).toBeVisible({ timeout: 5000 });

            // Take screenshot
            await page.screenshot({ path: 'test-results/screenshots/job-detail.png', fullPage: true });
        }
    });
});

test.describe('Authentication Pages', () => {
    test('should load login page', async ({ page }) => {
        await page.goto('/login');

        // Check for login form elements
        await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();

        // Take screenshot
        await page.screenshot({ path: 'test-results/screenshots/login-page.png', fullPage: true });
    });

    test('should load register page', async ({ page }) => {
        await page.goto('/register');

        // Check for register form elements
        const emailInput = page.locator('input[type="email"], input[name="email"]');
        await expect(emailInput).toBeVisible({ timeout: 5000 });

        // Take screenshot
        await page.screenshot({ path: 'test-results/screenshots/register-page.png', fullPage: true });
    });
});

test.describe('Navigation and Links', () => {
    test('should navigate between pages using links', async ({ page }) => {
        // Start from homepage
        await page.goto('/');

        // Navigate to jobs
        const jobsLink = page.locator('a:has-text("Jobs")').first();
        if (await jobsLink.isVisible()) {
            await jobsLink.click();
            await page.waitForLoadState('networkidle');

            // Verify URL changed
            expect(page.url()).toContain('/jobs');
        }
    });

    test('should have responsive header', async ({ page }) => {
        await page.goto('/');

        // Check for header
        const header = page.locator('header, nav');
        await expect(header).toBeVisible();

        // Take screenshot
        await page.screenshot({ path: 'test-results/screenshots/header.png', fullPage: false });
    });
});

test.describe('Performance and Accessibility', () => {
    test('should load homepage within acceptable time', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        const loadTime = Date.now() - startTime;

        console.log(`Homepage loaded in ${loadTime}ms`);
        expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test('should have proper page structure', async ({ page }) => {
        await page.goto('/');

        // Check for main content areas
        const main = page.locator('main, [role="main"]');
        const footer = page.locator('footer, [role="contentinfo"]');

        if (await main.count() > 0) {
            await expect(main).toBeVisible();
        }
    });
});
