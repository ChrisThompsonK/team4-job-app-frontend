import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test.describe("Member Login Flow", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.isLoaded();
  });

  test("should successfully log in a member with valid credentials", async ({ page }) => {
    // Arrange: Valid member credentials
    const validEmail = "member@example.com";
    const validPassword = "password123";

    // Act: Perform login
    await loginPage.login(validEmail, validPassword);

    // Assert: Verify successful login by checking if we're redirected away from login page
    // or if a success message appears
    await page.waitForTimeout(2000); // Wait for any redirects or messages

    // Check if we're no longer on login page (success) or if success message appears
    const isStillOnLogin = await loginPage.isOnLoginPage();
    const successMessage = await loginPage.getSuccessMessage();

    // Either we should be redirected away from login, or see a success message
    const loginSuccessful = !isStillOnLogin || successMessage !== null;

    expect(loginSuccessful).toBe(true);
  });
});
