import { test } from "@playwright/test";
import { BASE_URL } from "./constants";
import { generateUniqueEmail } from "./helpers";
import { HomePage, JobDetailPage, JobsPage, LoginPage, RegistrationPage } from "./pages";

/**
 * Exploratory Testing - Homepage Exploration
 *
 * This test suite covers the homepage exploration flow for the Kainos Job Portal
 */

test.describe("Homepage Exploration", () => {
  test("should display homepage with latest job postings", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.open();
    await homePage.verifyPageTitle();
    await homePage.verifyLogoIsVisible();
    await homePage.verifyNavigationMenu();
    await homePage.verifyHeroSection();
    await homePage.verifyLatestJobsSection();
    await homePage.verifyExploreJobsButton();
  });

  test("should navigate to jobs page from homepage", async ({ page }) => {
    const homePage = new HomePage(page);
    const jobsPage = new JobsPage(page);

    await homePage.open();
    await homePage.clickExploreJobs();
    await jobsPage.verifyUrl();
    await jobsPage.verifyHeading();
  });

  test("should navigate to job details from homepage job cards", async ({ page }) => {
    const homePage = new HomePage(page);
    const jobDetailPage = new JobDetailPage(page);

    await homePage.open();
    await homePage.waitForJobCards();

    const jobLinks = await homePage.getJobDetailLinks();

    if (jobLinks.length > 0) {
      await homePage.clickFirstJobDetailLink(jobLinks);
      await jobDetailPage.verifyUrl();
      await jobDetailPage.verifyHeadingVisible();
    } else {
      await homePage.verifyJobCardsVisible();
    }
  });
});

test.describe("User Registration Flow", () => {
  test("should display registration form with all required fields", async ({ page }) => {
    const homePage = new HomePage(page);
    const registrationPage = new RegistrationPage(page);

    await homePage.open();
    await homePage.navigateToRegister();
    await registrationPage.verifyUrl();
    await registrationPage.verifyHeading();
    await registrationPage.verifyFormFields();
    await registrationPage.verifySubmitButton();
  });

  test("should show validation errors for empty form submission", async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    await registrationPage.open();
    await registrationPage.submitEmptyForm();
    await registrationPage.verifyUrl();
  });

  test("should successfully register a new user with valid data", async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    await registrationPage.open();

    const testEmail = generateUniqueEmail();
    const testPassword = "SecurePassword123!";

    await registrationPage.fillRegistrationForm("Test", "User", testEmail, testPassword);
    await registrationPage.submitForm();
    await registrationPage.waitForNavigation();
    await registrationPage.verifySuccessfulRegistration(BASE_URL);
  });

  test("should navigate to login page from registration page", async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const loginPage = new LoginPage(page);

    await registrationPage.open();
    await registrationPage.clickSignInLink();
    await loginPage.verifyUrl();
    await loginPage.verifyHeading();
  });
});

test.describe("User Login Flow", () => {
  test("should display login page, success on login, success on logout", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const testEmail = "member@example.com";
    const testPassword = "password123";

    await loginPage.open();
    await loginPage.verifyUrl();
    await loginPage.verifyFormFields();

    await loginPage.fillLoginForm(testEmail, testPassword);
    await loginPage.submitForm();
    await loginPage.waitForNavigation();
    await loginPage.verifySuccessfulRegistration();

    await loginPage.logout();
    await loginPage.verifySuccessfulLogout();
  });

  test("should display error message for incorrect credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    const testEmail = generateUniqueEmail();
    const testPassword = "SecurePassword123!";

    await loginPage.fillLoginForm(testEmail, testPassword);
    await loginPage.submitForm();
    await loginPage.waitForNavigation();
    await loginPage.verifyUnsuccessfulRegistration();
  });
});
