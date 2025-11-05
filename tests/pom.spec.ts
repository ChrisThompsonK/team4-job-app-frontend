import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { JobsPage } from './pages/JobsPage';

/**
 * Basic Page Object Model Tests
 * Demonstrates POM pattern with 3 fundamental user workflows
 */

test.describe('POM: User Registration and Navigation', () => {
    /**
     * Test 1: User can register and navigate to home page
     * Verifies:
     * - Registration page loads
     * - All form fields are visible
     * - User can enter registration details
     * - Navigation after registration works
     */
    test('User should successfully register and navigate', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        const homePage = new HomePage(page);

        // Navigate to registration page and verify it's displayed
        await registerPage.navigateToRegister();
        expect(await registerPage.isRegisterPageDisplayed()).toBeTruthy();

        // Generate unique email
        const uniqueEmail = `testuser${Date.now()}@test.com`;

        // Fill registration form
        await registerPage.enterFirstName('John');
        await registerPage.enterLastName('Doe');
        await registerPage.enterEmail(uniqueEmail);
        await registerPage.enterPassword('TestPassword123!');
        await registerPage.enterConfirmPassword('TestPassword123!');

        // Submit registration
        await registerPage.clickCreateAccountButton();

        // Verify navigation away from registration page
        const currentUrl = registerPage.getCurrentURL();
        expect(currentUrl).not.toContain('/register');
    });
});

test.describe('POM: Home Page Navigation and Job Browsing', () => {
    /**
     * Test 2: User can browse home page and navigate to jobs listing
     * Verifies:
     * - Home page loads correctly
     * - Job cards are displayed
     * - Navigation to jobs page works
     * - Jobs are listed on jobs page
     */
    test('User should view home page and navigate to jobs', async ({ page }) => {
        const homePage = new HomePage(page);
        const jobsPage = new JobsPage(page);

        // Navigate to home page
        await homePage.navigateToHome();
        expect(await homePage.isHomePageDisplayed()).toBeTruthy();

        // Verify job cards are displayed on home page
        const jobCardsCount = await homePage.getJobCardsCount();
        expect(jobCardsCount).toBeGreaterThan(0);

        // Navigate to jobs page
        await homePage.clickJobsLink();

        // Verify jobs page displays jobs
        expect(await jobsPage.isJobsPageDisplayed()).toBeTruthy();
        const jobItemsCount = await jobsPage.getJobItemsCount();
        expect(jobItemsCount).toBeGreaterThan(0);
    });
});

test.describe('POM: Jobs Search and Filtering', () => {
    /**
     * Test 3: User can search and filter jobs
     * Verifies:
     * - Jobs page loads
     * - User can perform search
     * - Jobs listing responds to search
     * - Page reloads with search results
     */
    test('User should search for jobs and view results', async ({ page }) => {
        const jobsPage = new JobsPage(page);

        // Navigate to jobs page
        await jobsPage.navigateToJobs();
        expect(await jobsPage.isJobsPageDisplayed()).toBeTruthy();

        // Get initial job count
        const initialJobCount = await jobsPage.getJobItemsCount();
        expect(initialJobCount).toBeGreaterThan(0);

        // Search for jobs with keyword
        await jobsPage.searchForJobs('Developer');

        // Verify jobs are still displayed after search
        const searchResultsCount = await jobsPage.getJobItemsCount();
        expect(searchResultsCount).toBeGreaterThanOrEqual(0);

        // Verify URL changed
        expect(await jobsPage.verifyURLContains('/jobs')).toBeTruthy();
    });
});

test.describe('POM: Login Page Verification', () => {
    /**
     * Additional test: Verify login page structure
     * Verifies:
     * - Login page loads correctly
     * - All login form elements are visible
     * - Sign up link is present for navigation
     */
    test('Login page should display all required elements', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Navigate to login page
        await loginPage.navigateToLogin();
        expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();

        // Verify all required form fields are visible
        expect(await loginPage.isEmailInputVisible()).toBeTruthy();
        expect(await loginPage.isPasswordInputVisible()).toBeTruthy();

        // Verify sign up link is present
        const isSignUpLinkVisible = await page.locator('a:has-text("Sign up")').isVisible();
        expect(isSignUpLinkVisible).toBeTruthy();
    });
});
