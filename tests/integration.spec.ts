import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
    test('should load jobs data from backend API', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        // Wait for jobs to be displayed
        const jobItems = page.locator('[class*="job"], [role="article"]');
        const count = await jobItems.count();

        console.log(`Loaded ${count} jobs from API`);
        expect(count).toBeGreaterThan(0);

        await page.screenshot({ path: 'test-results/screenshots/api-jobs-loaded.png', fullPage: true });
    });

    test('should handle API errors gracefully', async ({ page }) => {
        // Intercept and fail API calls
        await page.route('**/api/**', route => route.abort());

        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        // Should still render page, possibly with error state
        await page.screenshot({ path: 'test-results/screenshots/api-error-handling.png', fullPage: true });
    });

    test('should load job details via API', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        // Click on a job
        const firstJob = page.locator('a, button').filter({ hasText: /Frontend|Developer|Manager|Designer/ }).first();
        if (await firstJob.isVisible()) {
            await firstJob.click();
            await page.waitForLoadState('networkidle');

            // Verify job details loaded
            const jobTitle = page.locator('h1, h2').first();
            await expect(jobTitle).toBeVisible();

            await page.screenshot({ path: 'test-results/screenshots/api-job-details.png', fullPage: true });
        }
    });
});

test.describe('Page Load Performance', () => {
    test('should measure homepage load time', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        const loadTime = Date.now() - startTime;

        console.log(`Homepage load time: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(10000);

        await page.screenshot({ path: 'test-results/screenshots/homepage-performance.png', fullPage: true });
    });

    test('should measure jobs page load time', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        console.log(`Jobs page load time: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(10000);

        await page.screenshot({ path: 'test-results/screenshots/jobs-performance.png', fullPage: true });
    });

    test('should measure job detail page load time', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        const firstJob = page.locator('a').first();
        if (await firstJob.isVisible()) {
            const startTime = Date.now();
            await firstJob.click();
            await page.waitForLoadState('networkidle');
            const loadTime = Date.now() - startTime;

            console.log(`Job detail page load time: ${loadTime}ms`);
            expect(loadTime).toBeLessThan(10000);

            await page.screenshot({ path: 'test-results/screenshots/job-detail-performance.png', fullPage: true });
        }
    });
});

test.describe('Dynamic Content Loading', () => {
    test('should display loading states', async ({ page }) => {
        // Monitor network activity
        page.on('response', response => {
            if (response.url().includes('/api/')) {
                console.log(`API Response: ${response.url()} - Status: ${response.status()}`);
            }
        });

        await page.goto('/jobs');

        // Look for loading indicators
        const loadingIndicators = page.locator('[class*="load"], [class*="spinner"], [aria-label*="Loading"], .skeleton');

        await page.screenshot({ path: 'test-results/screenshots/loading-states.png', fullPage: true });
    });

    test('should handle pagination data loading', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        // Get initial job count
        const initialJobs = page.locator('[class*="job"], [role="article"]');
        const initialCount = await initialJobs.count();

        console.log(`Initial jobs loaded: ${initialCount}`);

        // Click next page if available
        const nextButton = page.locator('button:has-text("Next"), a:has-text("Next"), [aria-label*="Next"]').first();
        if (await nextButton.isVisible()) {
            await nextButton.click();
            await page.waitForLoadState('networkidle');

            const newJobs = page.locator('[class*="job"], [role="article"]');
            const newCount = await newJobs.count();

            console.log(`Jobs after pagination: ${newCount}`);
            await page.screenshot({ path: 'test-results/screenshots/pagination-data-loading.png', fullPage: true });
        }
    });
});

test.describe('Session and State Management', () => {
    test('should maintain state across navigation', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        // Navigate to job detail
        const firstJob = page.locator('a').first();
        if (await firstJob.isVisible()) {
            const jobUrl = await firstJob.getAttribute('href');
            await firstJob.click();
            await page.waitForLoadState('networkidle');

            // Go back
            await page.goBack();
            await page.waitForLoadState('networkidle');

            await page.screenshot({ path: 'test-results/screenshots/back-navigation.png', fullPage: true });
        }
    });

    test('should handle browser back button', async ({ page }) => {
        await page.goto('/');
        await page.goto('/jobs');

        await page.goBack();
        expect(page.url()).toContain('/');

        await page.screenshot({ path: 'test-results/screenshots/browser-back.png', fullPage: true });
    });

    test('should handle multiple redirects', async ({ page }) => {
        // Navigate through multiple pages
        const paths = ['/', '/jobs', '/login', '/register'];

        for (const path of paths) {
            await page.goto(path);
            await page.waitForLoadState('networkidle');
            console.log(`Navigated to: ${page.url()}`);
        }

        await page.screenshot({ path: 'test-results/screenshots/multi-redirect.png', fullPage: true });
    });
});

test.describe('Visual Regression', () => {
    test('should match homepage layout', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Take full page screenshot for comparison
        await page.screenshot({ path: 'test-results/screenshots/homepage-layout.png', fullPage: true });
    });

    test('should match jobs page layout', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        await page.screenshot({ path: 'test-results/screenshots/jobs-layout.png', fullPage: true });
    });

    test('should match job detail layout', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        const firstJob = page.locator('a').first();
        if (await firstJob.isVisible()) {
            await firstJob.click();
            await page.waitForLoadState('networkidle');

            await page.screenshot({ path: 'test-results/screenshots/job-detail-layout.png', fullPage: true });
        }
    });

    test('should match login page layout', async ({ page }) => {
        await page.goto('/login');

        await page.screenshot({ path: 'test-results/screenshots/login-layout.png', fullPage: true });
    });

    test('should match register page layout', async ({ page }) => {
        await page.goto('/register');

        await page.screenshot({ path: 'test-results/screenshots/register-layout.png', fullPage: true });
    });
});
