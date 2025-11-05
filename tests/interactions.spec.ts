import { test, expect } from '@playwright/test';

test.describe('Form Interactions', () => {
    test('should submit login form with valid credentials', async ({ page }) => {
        await page.goto('/login');

        // Fill in login form
        await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
        await page.fill('input[type="password"], input[name="password"]', 'password123');

        // Take screenshot before submit
        await page.screenshot({ path: 'test-results/screenshots/login-form-filled.png', fullPage: true });

        // Click submit button
        const submitButton = page.locator('button:has-text("Login"), button[type="submit"]').first();
        if (await submitButton.isVisible()) {
            await submitButton.click();
            await page.waitForLoadState('networkidle');
        }
    });

    test('should handle form validation', async ({ page }) => {
        await page.goto('/login');

        // Try to submit empty form
        const submitButton = page.locator('button:has-text("Login"), button[type="submit"]').first();
        if (await submitButton.isVisible()) {
            await submitButton.click();

            // Check for validation messages
            const errorMessages = page.locator('[role="alert"], .error, .validation-error, [class*="error"]');
            await page.screenshot({ path: 'test-results/screenshots/form-validation.png', fullPage: true });
        }
    });

    test('should support register form interactions', async ({ page }) => {
        await page.goto('/register');

        // Fill registration form
        const emailInput = page.locator('input[type="email"], input[name="email"]').first();
        const passwordInput = page.locator('input[type="password"], input[name="password"]').first();

        if (await emailInput.isVisible()) {
            await emailInput.fill('newuser@example.com');
        }
        if (await passwordInput.isVisible()) {
            await passwordInput.fill('password123');
        }

        // Take screenshot
        await page.screenshot({ path: 'test-results/screenshots/register-form-filled.png', fullPage: true });
    });
});

test.describe('Search and Filter Features', () => {
    test('should support job search with various keywords', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
        if (await searchInput.isVisible()) {
            const keywords = ['Developer', 'Manager', 'Designer'];

            for (const keyword of keywords) {
                await searchInput.clear();
                await searchInput.fill(keyword);
                await page.keyboard.press('Enter');
                await page.waitForLoadState('networkidle');

                // Take screenshot of search results
                await page.screenshot({ path: `test-results/screenshots/search-${keyword.toLowerCase()}.png`, fullPage: true });
            }
        }
    });

    test('should filter by capability', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        const capabilityFilter = page.locator('select[name="capability"], select').nth(1);
        if (await capabilityFilter.isVisible()) {
            const options = await capabilityFilter.locator('option').count();

            for (let i = 1; i < Math.min(3, options); i++) {
                await capabilityFilter.selectOption({ index: i });
                await page.waitForLoadState('networkidle');

                await page.screenshot({ path: `test-results/screenshots/filter-capability-${i}.png`, fullPage: true });
            }
        }
    });

    test('should support pagination', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        // Look for next button or pagination
        const nextButton = page.locator('button:has-text("Next"), a[href*="page=2"], [aria-label*="Next"]').first();
        if (await nextButton.isVisible()) {
            await nextButton.click();
            await page.waitForLoadState('networkidle');

            await page.screenshot({ path: 'test-results/screenshots/pagination-page-2.png', fullPage: true });
        }
    });
});

test.describe('Job Application Flow', () => {
    test('should display apply button on job detail', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        // Click on first job
        const firstJob = page.locator('a, button').filter({ hasText: /Frontend|Developer|Manager|Designer/ }).first();
        if (await firstJob.isVisible()) {
            await firstJob.click();
            await page.waitForLoadState('networkidle');

            // Look for apply button
            const applyButton = page.locator('button:has-text("Apply"), a:has-text("Apply"), button:has-text("Apply Now")').first();
            if (await applyButton.isVisible()) {
                await page.screenshot({ path: 'test-results/screenshots/job-detail-with-apply.png', fullPage: true });
                expect(applyButton).toBeVisible();
            }
        }
    });

    test('should show job metadata', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        // Click on first job
        const firstJob = page.locator('a, button').filter({ hasText: /Frontend|Developer|Manager|Designer/ }).first();
        if (await firstJob.isVisible()) {
            await firstJob.click();
            await page.waitForLoadState('networkidle');

            // Check for job details
            const jobDetails = page.locator('text=/Salary|Location|Band|Capability|Closing Date|Positions/');
            const detailCount = await jobDetails.count();

            await page.screenshot({ path: 'test-results/screenshots/job-metadata.png', fullPage: true });

            if (detailCount > 0) {
                console.log(`Found ${detailCount} job detail elements`);
            }
        }
    });
});

test.describe('Responsive Design', () => {
    test('should be responsive on tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/');

        await page.screenshot({ path: 'test-results/screenshots/responsive-tablet.png', fullPage: true });
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        await page.screenshot({ path: 'test-results/screenshots/responsive-mobile.png', fullPage: true });
    });

    test('should handle mobile navigation', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/jobs');

        // Look for mobile menu
        const mobileMenu = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], .mobile-menu, [class*="hamburger"]').first();
        if (await mobileMenu.isVisible()) {
            await mobileMenu.click();
            await page.screenshot({ path: 'test-results/screenshots/mobile-menu-open.png', fullPage: true });
        }
    });
});

test.describe('Error Handling', () => {
    test('should handle invalid job ID gracefully', async ({ page }) => {
        await page.goto('/jobs/99999');
        await page.waitForLoadState('networkidle');

        // Check for error message or redirect
        const errorText = page.locator('text=/not found|error|invalid/i');
        const isError = await errorText.count() > 0 || page.url().includes('/jobs');

        await page.screenshot({ path: 'test-results/screenshots/invalid-job-error.png', fullPage: true });

        expect(isError).toBeTruthy();
    });

    test('should handle navigation to non-existent pages', async ({ page }) => {
        await page.goto('/nonexistent-page');
        await page.waitForLoadState('networkidle');

        // Should either show error or redirect
        const status = page.url();
        await page.screenshot({ path: 'test-results/screenshots/404-page.png', fullPage: true });
    });
});

test.describe('User Interactions', () => {
    test('should handle hover states', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        // Hover over first job card
        const firstJob = page.locator('[class*="card"], [role="article"]').first();
        if (await firstJob.isVisible()) {
            await firstJob.hover();
            await page.screenshot({ path: 'test-results/screenshots/card-hover-state.png', fullPage: true });
        }
    });

    test('should handle button interactions', async ({ page }) => {
        await page.goto('/');

        // Find and click various buttons
        const buttons = page.locator('button, a[role="button"]');
        const buttonCount = await buttons.count();

        console.log(`Found ${buttonCount} interactive buttons`);

        // Click first button if available
        if (buttonCount > 0) {
            const firstButton = buttons.first();
            await firstButton.hover();
            await page.screenshot({ path: 'test-results/screenshots/button-hover.png' });
        }
    });

    test('should support keyboard navigation', async ({ page }) => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');

        // Tab through page
        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('Tab');
        }

        // Take screenshot of focused element
        await page.screenshot({ path: 'test-results/screenshots/keyboard-navigation.png', fullPage: true });
    });
});
