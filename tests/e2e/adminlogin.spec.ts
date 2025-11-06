import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test.describe("Admin Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Log test start and URL for debugging
    console.log(`Starting test on ${page.url()}`);

    // Capture any console messages from the page
    page.on("console", (msg) => console.log(`PAGE LOG (${msg.type()}):`, msg.text()));
    page.on("pageerror", (err) => console.error("PAGE ERROR:", err));
  });

  test("should show error message for invalid admin credentials", async ({ page }) => {
    const invalidAdminEmail = "invalid@example.com";
    const invalidAdminPassword = "wrongpassword";

    const loginPage = new LoginPage(page);

    try {
      await loginPage.goto();
      console.log("✅ Navigated to login page");

      await loginPage.isLoaded();
      console.log("✅ Login page loaded");

      await loginPage.login(invalidAdminEmail, invalidAdminPassword);
      console.log("✅ Submitted login form with invalid credentials");

      const errorMessage = await loginPage.getErrorMessage();
      console.log(`Error message received: ${errorMessage}`);

      expect(errorMessage).not.toBeNull();
    } catch (error) {
      console.error("❌ Test failed:", error);
      throw error;
    }
  });

  test("should successfully log in an admin with valid credentials", async ({ page }) => {
    const validAdminEmail = "admin@example.com";
    const validAdminPassword = "password123";

    const loginPage = new LoginPage(page);

    try {
      await loginPage.goto();
      console.log("✅ Navigated to login page");

      await loginPage.isLoaded();
      console.log("✅ Login page loaded");

      await loginPage.login(validAdminEmail, validAdminPassword);
      console.log("✅ Submitted login form with valid credentials");

      // Wait for navigation to complete
      await page.waitForLoadState("networkidle");
      console.log(`✅ Page load complete, current URL: ${page.url()}`);

      const isStillOnLogin = await loginPage.isOnLoginPage();
      const successMessage = await loginPage.getSuccessMessage();

      console.log(`Still on login page: ${isStillOnLogin}`);
      console.log(`Success message: ${successMessage}`);

      const loginSuccessful = !isStillOnLogin || successMessage !== null;
      expect(loginSuccessful).toBe(true);
    } catch (error) {
      console.error("❌ Test failed:", error);
      throw error;
    }
  });
});
