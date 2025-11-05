# Page Object Model (POM) Testing Guide

## Overview

This document describes the Page Object Model (POM) pattern implementation for the Job Application Platform end-to-end tests. The POM pattern is a best practice for test automation that improves maintainability, readability, and reduces code duplication.

## What is the Page Object Model?

The Page Object Model is a design pattern that represents each page as a class. All elements and interactions on a page are encapsulated within that class, making tests more readable and maintainable.

### Benefits:
- **Maintainability**: Changes to UI are made in one place (the page object)
- **Readability**: Tests read like user actions rather than technical details
- **Reusability**: Page objects can be used across multiple tests
- **Abstraction**: Tests focus on behavior, not implementation details

## Project Structure

```
tests/
├── pages/                    # Page Object Model classes
│   ├── BasePage.ts          # Base class with common methods
│   ├── LoginPage.ts         # Login page object
│   ├── RegisterPage.ts      # Register page object
│   ├── HomePage.ts          # Home page object
│   └── JobsPage.ts          # Jobs listing page object
├── pom.spec.ts             # Basic POM tests (recommended pattern)
├── workflows.spec.ts       # Refactored workflow tests using POM
├── ui.spec.ts              # Legacy tests (not using POM)
└── integration.spec.ts      # Legacy tests (not using POM)
```

## Page Object Classes

### BasePage
The foundation class for all page objects with common methods:

```typescript
// Constructor
constructor(page: Page)

// Navigation
goto(path: string)
getCurrentURL()
getPageTitle()
waitForPageLoad()

// Element Interaction
fillInput(selector: string, text: string)
click(selector: string)
getText(selector: string)
isElementVisible(selector: string)

// Utilities
takeScreenshot(path: string)
verifyURLContains(expectedText: string)
```

**Example:**
```typescript
const basePage = new BasePage(page);
await basePage.goto('/');
await basePage.fillInput('input[name="email"]', 'user@example.com');
```

### LoginPage
Encapsulates login page elements and interactions:

```typescript
// Navigation
navigateToLogin()

// Actions
enterEmail(email: string)
enterPassword(password: string)
clickLoginButton()
login(email: string, password: string)  // Complete action

// Verification
isLoginPageDisplayed()
isEmailInputVisible()
isPasswordInputVisible()
getErrorMessage()
```

**Example:**
```typescript
const loginPage = new LoginPage(page);
await loginPage.login('user@example.com', 'password123');
```

### RegisterPage
Encapsulates registration page elements and interactions:

```typescript
// Navigation
navigateToRegister()

// Actions
enterFirstName(firstName: string)
enterLastName(lastName: string)
enterEmail(email: string)
enterPassword(password: string)
enterConfirmPassword(confirmPassword: string)
clickCreateAccountButton()
register(firstName, lastName, email, password, confirmPassword)  // Complete action

// Verification
isRegisterPageDisplayed()
getErrorMessage()
```

**Example:**
```typescript
const registerPage = new RegisterPage(page);
await registerPage.register('John', 'Doe', 'john@example.com', 'pwd123', 'pwd123');
```

### HomePage
Encapsulates home page elements and navigation:

```typescript
// Navigation
navigateToHome()

// Navigation Links
clickJobsLink()
clickProfileLink()
clickLoginLink()
clickRegisterLink()
clickLogout()

// Verification
isHomePageDisplayed()
isUserLoggedIn()
isUserLoggedOut()
getJobCardsCount()
getPageHeadingText()
```

**Example:**
```typescript
const homePage = new HomePage(page);
await homePage.navigateToHome();
const loggedIn = await homePage.isUserLoggedIn();
await homePage.clickJobsLink();
```

### JobsPage
Encapsulates jobs listing page elements and interactions:

```typescript
// Navigation
navigateToJobs()

// Search & Filter
searchForJobs(keyword: string)
filterByLocation(locationIndex: number)
filterByCapability(capabilityIndex: number)

// Job Interactions
clickFirstJob()
clickJobAtIndex(index: number)
clickNextButton()
clickPreviousButton()

// Verification
isJobsPageDisplayed()
getJobItemsCount()
getJobTitles()
hasNextButton()
hasPreviousButton()
```

**Example:**
```typescript
const jobsPage = new JobsPage(page);
await jobsPage.navigateToJobs();
await jobsPage.searchForJobs('Developer');
const count = await jobsPage.getJobItemsCount();
```

## Test Examples

### Test 1: User Registration and Navigation
```typescript
test('User should successfully register and navigate', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const homePage = new HomePage(page);

    // Navigate and register
    await registerPage.navigateToRegister();
    await registerPage.register('John', 'Doe', 'john@example.com', 'pwd123', 'pwd123');

    // Verify navigation away from register page
    const currentUrl = registerPage.getCurrentURL();
    expect(currentUrl).not.toContain('/register');
});
```

### Test 2: Home Page Navigation and Job Browsing
```typescript
test('User should view home page and navigate to jobs', async ({ page }) => {
    const homePage = new HomePage(page);
    const jobsPage = new JobsPage(page);

    // Navigate to home
    await homePage.navigateToHome();
    expect(await homePage.isHomePageDisplayed()).toBeTruthy();

    // Verify jobs displayed
    const jobCards = await homePage.getJobCardsCount();
    expect(jobCards).toBeGreaterThan(0);

    // Navigate to jobs page
    await homePage.clickJobsLink();
    expect(await jobsPage.isJobsPageDisplayed()).toBeTruthy();
});
```

### Test 3: Jobs Search and Filtering
```typescript
test('User should search for jobs and view results', async ({ page }) => {
    const jobsPage = new JobsPage(page);

    // Navigate to jobs
    await jobsPage.navigateToJobs();
    expect(await jobsPage.isJobsPageDisplayed()).toBeTruthy();

    // Perform search
    await jobsPage.searchForJobs('Developer');

    // Verify results
    const count = await jobsPage.getJobItemsCount();
    expect(count).toBeGreaterThanOrEqual(0);
});
```

## Writing New Tests with POM

### Step 1: Create Page Object (if needed)
```typescript
export class MyPage extends BasePage {
    readonly mySelector = 'button.my-button';
    
    async clickMyButton(): Promise<void> {
        await this.click(this.mySelector);
    }
}
```

### Step 2: Write Test Using Page Object
```typescript
test('My test description', async ({ page }) => {
    const myPage = new MyPage(page);
    
    await myPage.goto('/my-page');
    await myPage.clickMyButton();
    
    expect(await myPage.verifyURLContains('/expected-path')).toBeTruthy();
});
```

### Best Practices:

1. **Use Descriptive Selectors**: Store selectors as readonly properties
   ```typescript
   readonly emailInput = 'input[name="email"]';
   ```

2. **Create Action Methods**: Combine multiple actions into single methods
   ```typescript
   async login(email: string, password: string): Promise<void> {
       await this.enterEmail(email);
       await this.enterPassword(password);
       await this.clickLoginButton();
   }
   ```

3. **Use Verification Methods**: Create methods to check page state
   ```typescript
   async isLoggedIn(): Promise<boolean> {
       return await this.isElementVisible(this.logoutButton);
   }
   ```

4. **Keep Tests Readable**: Tests should read like user actions
   ```typescript
   // Good - reads like user actions
   await homePage.navigateToHome();
   await homePage.clickJobsLink();
   
   // Bad - too technical
   await page.goto('/');
   await page.locator('a:has-text("Jobs")').click();
   ```

5. **Avoid Test Logic in Page Objects**: Page objects should only contain selectors and methods
   ```typescript
   // Good - in page object
   async clickLoginButton(): Promise<void> {
       await this.click(this.loginButton);
   }
   
   // Bad - test logic in page object
   async login(email: string, password: string): Promise<void> {
       if (!email) throw new Error('Email required');
       // ...
   }
   ```

## Running Tests

### Run all POM tests:
```bash
npm run test:e2e:headed
```

### Run specific test file:
```bash
npm run test:e2e:headed -- tests/pom.spec.ts
```

### Run specific test:
```bash
npm run test:e2e:headed -- tests/pom.spec.ts -g "Registration"
```

### Run with debugging:
```bash
npm run test:e2e:debug
```

## Comparison: Before and After

### Before (Without POM)
```typescript
test('Register user', async ({ page }) => {
    await page.goto('/register');
    await page.locator('input[name="firstName"]').fill('John');
    await page.locator('input[name="lastName"]').fill('Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('input[name="password"]').fill('pwd123');
    await page.locator('input[name="confirmPassword"]').fill('pwd123');
    await page.locator('button:has-text("Create Account")').click();
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).not.toContain('/register');
});
```

### After (With POM)
```typescript
test('User should successfully register', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    await registerPage.register('John', 'Doe', 'john@example.com', 'pwd123', 'pwd123');
    
    const currentUrl = registerPage.getCurrentURL();
    expect(currentUrl).not.toContain('/register');
});
```

## Key Improvements:

✅ **40% less code** - Less duplication of selectors
✅ **More readable** - Tests focus on behavior
✅ **Easier maintenance** - Selector changes in one place
✅ **Reusable** - Page objects used across multiple tests
✅ **Professional** - Industry best practice

## Migration Guide

To migrate existing tests to POM:

1. **Identify page objects** - Which pages does your test interact with?
2. **Extract selectors** - Move all selectors to page object
3. **Create methods** - Encapsulate user actions as methods
4. **Refactor tests** - Replace selectors with method calls
5. **Verify tests pass** - Run tests to ensure functionality

## Refactored Tests

The `workflows.spec.ts` file has been refactored to use POM. Compare it with `ui.spec.ts` to see the difference.

## Resources

- [Playwright Documentation](https://playwright.dev/docs/pom)
- [Page Object Model Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
- [Best Practices for Maintainable Test Code](https://playwright.dev/docs/best-practices)

## Troubleshooting

### Test fails with "Cannot find element"
- Check selector in page object
- Verify page has fully loaded (waitForPageLoad())
- Check browser state matches expectations

### Flaky tests
- Add appropriate waits (waitForPageLoad, waitForElementVisible)
- Use explicit waits instead of arbitrary delays
- Check for timing issues in page object methods

### Tests run slowly
- Check for unnecessary page loads
- Optimize selectors for performance
- Consider running tests in parallel
