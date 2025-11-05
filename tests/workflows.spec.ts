import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';

/**
 * Workflow Tests for Job Application Platform (Using Page Object Model)
 * Tests complete user journeys including:
 * - Member registration and navigation
 * - Job browsing and filtering
 * - Navigation workflows
 */

// Test user data
const MEMBER_USER = {
    email: `member${Date.now()}@test.com`,
    password: 'TestPassword123!',
    firstName: 'Test123',
    lastName: 'Member',
};

test('Simple Member Workflow: Register and Navigate', async ({ page }) => {
    // Initialize page objects
    const registerPage = new RegisterPage(page);
    const homePage = new HomePage(page);

    // Register as member using POM
    await registerPage.navigateToRegister();
    await registerPage.enterFirstName(MEMBER_USER.firstName);
    await registerPage.enterLastName(MEMBER_USER.lastName);
    await registerPage.enterEmail(MEMBER_USER.email);
    await registerPage.enterPassword(MEMBER_USER.password);
    await registerPage.enterConfirmPassword(MEMBER_USER.password);
    await registerPage.clickCreateAccountButton();

    // Wait for navigation - don't wait for specific URL since redirect might vary
    await registerPage.waitForPageLoad();

    // Verify we're not on the register page anymore
    const url = registerPage.getCurrentURL();
    expect(url).not.toContain('/register');
});
