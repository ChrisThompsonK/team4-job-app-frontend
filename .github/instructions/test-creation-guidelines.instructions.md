---
applyTo: '**'
---

# Test Creation Guidelines for LLMs

This document outlines the standards and best practices for creating tests in the **team4-job-app-frontend** project. All LLMs should follow these guidelines when creating new tests.

---

## Test Types

The project uses **two types of tests**:

### 1. **Playwright E2E Tests** (End-to-End)
- **Location**: `tests/` directory
- **File Pattern**: `*.spec.ts`
- **Purpose**: Test complete user flows and interactions with the application UI
- **Framework**: Playwright Test
- **Target**: Browser automation and UI testing

### 2. **Vitest Unit Tests** (Unit)
- **Location**: `src/` directory (colocated with source files)
- **File Pattern**: `*.test.ts`
- **Purpose**: Test individual functions, services, and utilities in isolation
- **Framework**: Vitest
- **Target**: Business logic and utility functions

---

## Playwright E2E Tests

### Configuration

**File**: `playwright.config.ts`

```typescript
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: ["html", "list"],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
```

### Test Structure

**File Location**: `tests/your-feature.spec.ts`

```typescript
import { test, expect } from "@playwright/test";
import { HomePage, YourPage } from "./pages";

// TEST SUITE - Organize tests by feature or user flow
test.describe("Feature Name", () => {
  // TEST CASE - Each test should have a clear, descriptive name
  test("should perform specific action with expected outcome", async ({ page }) => {
    // 1. ARRANGE - Initialize page objects
    const homePage = new HomePage(page);
    const yourPage = new YourPage(page);

    // 2. ACT - Perform user interactions
    await homePage.open();
    await homePage.clickLink();

    // 3. ASSERT - Verify expectations
    await yourPage.verifyPageLoaded();
    await expect(yourPage.heading).toBeVisible();
  });

  test("should handle error states gracefully", async ({ page }) => {
    const yourPage = new YourPage(page);
    
    await yourPage.open();
    await yourPage.submitInvalidData();
    await yourPage.verifyErrorMessage();
  });
});
```

### Test Naming Conventions

- **Descriptive**: `should navigate to jobs page when explore jobs button is clicked`
- **Avoid**: `test navigation`, `button click test`
- **Format**: `should [action] when [condition] [expected outcome]`

### Test Organization

Group related tests using `test.describe()`:

```typescript
test.describe("User Authentication", () => {
  test("should display login form", async ({ page }) => { /* ... */ });
  test("should login with valid credentials", async ({ page }) => { /* ... */ });
  test("should show error with invalid credentials", async ({ page }) => { /* ... */ });
});
```

---

## Page Object Model Pattern

### Purpose

The **Page Object Model (POM)** pattern encapsulates page UI elements and interactions, making tests:
- More maintainable
- Less brittle
- Easier to update when UI changes
- More readable

### BasePage Class

All page objects extend `BasePage`:

**File**: `tests/pages/BasePage.ts`

```typescript
import type { Page, Locator } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string = "/") {
    await this.page.goto(`http://localhost:3000${path}`);
  }

  async getPageTitle() {
    return this.page.title();
  }

  async getCurrentUrl() {
    return this.page.url();
  }
}
```

### Creating a New Page Object

**File**: `tests/pages/YourPage.ts`

```typescript
import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Your Page Object - Represents a specific page or feature in the application
 */
export class YourPage extends BasePage {
  // LOCATORS - Define all UI elements as readonly properties
  readonly heading: Locator;
  readonly submitButton: Locator;
  readonly emailField: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators using best practices (see below)
    this.heading = page.getByRole("heading", { name: "Page Title" });
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.emailField = page.locator("#email");
    this.errorMessage = page.getByText(/Error occurred/i);
  }

  // ACTIONS - Methods representing user interactions
  async open() {
    await this.goto("/your-path");
  }

  async fillForm(email: string, name: string) {
    await this.emailField.fill(email);
    await this.page.getByLabel("Name").fill(name);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  // ASSERTIONS - Methods for verifying page state
  async verifyPageLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(/\/your-path/);
  }

  async verifyErrorMessageDisplayed() {
    await expect(this.errorMessage).toBeVisible();
  }

  // UTILITIES - Helper methods
  generateUniqueEmail(): string {
    const timestamp = Date.now();
    return `testuser${timestamp}@example.com`;
  }
}
```

### Locator Priority (Best Practices)

Use locators in this order of preference:

1. **Semantic Role-based** (Most Maintainable)
   ```typescript
   this.submitButton = page.getByRole("button", { name: "Submit" });
   this.link = page.getByRole("link", { name: "Home" });
   this.heading = page.getByRole("heading", { name: "Welcome" });
   ```

2. **Label-based** (For Form Fields)
   ```typescript
   this.emailField = page.getByLabel("Email Address");
   this.passwordField = page.getByLabel("Password");
   ```

3. **Text Content**
   ```typescript
   this.errorMessage = page.getByText("An error occurred");
   this.successMessage = page.getByText(/Success/i); // Case-insensitive
   ```

4. **CSS Selectors** (Last Resort)
   ```typescript
   this.element = page.locator("#specific-id");
   this.element = page.locator(".class-name");
   ```

5. **Avoid** (Too Brittle)
   ```typescript
   // DON'T USE - brittle to changes
   this.button = page.locator("button:nth-child(3)");
   this.element = page.locator("div > div > span");
   ```

### Exporting Page Objects

**File**: `tests/pages/index.ts`

```typescript
export { BasePage } from "./BasePage";
export { HomePage } from "./HomePage";
export { LoginPage } from "./LoginPage";
export { YourPage } from "./YourPage";
```

Then import in tests:

```typescript
import { HomePage, YourPage } from "./pages";
```

---

## Vitest Unit Tests

### Configuration

**File**: `vitest.config.ts`

```typescript
export default defineConfig({
  test: {
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    environment: "node",
    testTimeout: 10000,
    globals: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

### Test Structure

**File Location**: `src/services/myService.test.ts`

```typescript
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { MyService } from "./myService";

/**
 * Unit tests for MyService
 * Tests should be focused on business logic and edge cases
 */
describe("MyService", () => {
  let service: MyService;

  // Setup before each test
  beforeEach(() => {
    service = new MyService();
  });

  // Cleanup after each test
  afterEach(() => {
    // Reset state, clear mocks, etc.
  });

  describe("someMethod", () => {
    it("should return expected value for valid input", () => {
      // ARRANGE
      const input = "test-value";
      const expected = "expected-result";

      // ACT
      const result = service.someMethod(input);

      // ASSERT
      expect(result).toBe(expected);
    });

    it("should throw error for invalid input", () => {
      expect(() => {
        service.someMethod(null);
      }).toThrow();
    });

    it("should handle edge cases", () => {
      expect(service.someMethod("")).toBe("default-value");
      expect(service.someMethod("   ")).toBe("trimmed-value");
    });
  });
});
```

### Unit Test Best Practices

- **Test behavior, not implementation**: Focus on what the function should do, not how it does it
- **One assertion per test** (or related assertions): Keep tests focused
- **Use descriptive test names**: `should return user when ID exists` not `test get user`
- **Test edge cases**: null values, empty strings, boundary conditions
- **Keep tests fast**: Unit tests should run in milliseconds
- **Avoid test interdependencies**: Each test should be independent
- **Mock external dependencies**: Use `vi.mock()` for external services

---

## Best Practices

### AAA Pattern (Arrange, Act, Assert)

All tests should follow the AAA pattern:

```typescript
test("should login successfully", async ({ page }) => {
  // ARRANGE - Set up test data and initial state
  const loginPage = new LoginPage(page);
  const testEmail = "user@example.com";
  const testPassword = "SecurePassword123!";

  // ACT - Perform the action being tested
  await loginPage.open();
  await loginPage.fillLoginForm(testEmail, testPassword);
  await loginPage.submitForm();

  // ASSERT - Verify the expected outcome
  await loginPage.verifySuccessfulLogin();
});
```

### Wait for Elements (Not Hard Sleeps)

```typescript
// ✓ GOOD - Uses explicit waits
await page.waitForSelector("h3", { timeout: 5000 });
await expect(element).toBeVisible();

// ✗ BAD - Hard sleep is unpredictable
await page.waitForTimeout(3000);
```

### Use Test Data Factories

```typescript
generateUniqueEmail(): string {
  const timestamp = Date.now();
  return `testuser${timestamp}@example.com`;
}
```

### Cleanup After Tests

```typescript
test.afterEach(async ({ page }) => {
  // Clean up test data if needed
  // Log out if needed
});
```

### Error Handling and Retry Logic

```typescript
async submitForm() {
  try {
    await this.submitButton.click();
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
}
```

### URL and Navigation Assertions

```typescript
async verifyUrl() {
  // ✓ GOOD - Uses regex for flexibility
  await expect(this.page).toHaveURL(/\/login/);

  // ✗ BAD - Brittle to URL parameter changes
  await expect(this.page).toHaveURL("http://localhost:3000/login?source=home");
}
```

---

## File Organization

### Directory Structure

```
team4-job-app-frontend/
├── tests/
│   ├── pages/
│   │   ├── BasePage.ts           # Base class for all pages
│   │   ├── HomePage.ts           # Homepage page object
│   │   ├── LoginPage.ts          # Login page object
│   │   ├── JobsPage.ts           # Jobs listing page object
│   │   └── index.ts              # Barrel export
│   ├── exploratory-flows.spec.ts # E2E test suite
│   └── feature-flow.spec.ts      # Additional feature tests
│
├── src/
│   ├── services/
│   │   ├── jobService.ts
│   │   └── jobService.test.ts    # Unit test (colocated)
│   ├── controllers/
│   │   ├── formController.ts
│   │   └── formController.test.ts # Unit test (colocated)
│   └── utils.test.ts             # Utility tests
│
├── .github/
│   └── instructions/
│       ├── test-creation-guidelines.md    # This file
│       └── test-case-template.md          # Test case template
│
└── playwright.config.ts           # Playwright configuration
```

### Naming Conventions

- **Page Objects**: `PascalCase` + `Page` suffix
  - ✓ `HomePage.ts`, `LoginPage.ts`, `JobDetailPage.ts`
  - ✗ `homePage.ts`, `home-page.ts`

- **Test Files**: `kebab-case.spec.ts` or `kebab-case.test.ts`
  - ✓ `exploratory-flows.spec.ts`, `job-detail.test.ts`
  - ✗ `exploratoryFlows.spec.ts`, `jobDetailTest.ts`

- **Methods**: `camelCase` with verb prefixes
  - ✓ `fillLoginForm()`, `verifyPageLoaded()`, `clickSubmitButton()`
  - ✗ `login_form()`, `check_page()`, `submit_button()`

---

## Running Tests

### Playwright E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test tests/exploratory-flows.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run single test
npx playwright test -g "should login successfully"

# View test report
npx playwright show-report
```

### Vitest Unit Tests

```bash
# Run all unit tests
npm run test

# Run specific test file
npm run test src/services/jobService.test.ts

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Common Patterns

### Testing Form Submission

```typescript
test("should submit form with valid data", async ({ page }) => {
  const form = new YourPage(page);

  await form.open();
  await form.fillForm("test@example.com", "Test User");
  await form.submitForm();
  
  // Wait for navigation or success message
  await form.waitForNavigation();
  await form.verifySuccessMessage();
});
```

### Testing Error States

```typescript
test("should display error for invalid input", async ({ page }) => {
  const form = new YourPage(page);

  await form.open();
  await form.fillForm("invalid-email", "");
  await form.submitForm();
  
  await form.verifyErrorMessage("Please enter a valid email");
});
```

### Testing Navigation

```typescript
test("should navigate between pages", async ({ page }) => {
  const home = new HomePage(page);
  const jobs = new JobsPage(page);

  await home.open();
  await home.clickJobsLink();
  
  await jobs.verifyUrl();
  await jobs.verifyHeading();
});
```

---

## Checklist for New Tests

- [ ] Test has a clear, descriptive name
- [ ] Test follows AAA pattern (Arrange, Act, Assert)
- [ ] Page objects use semantic locators (role-based)
- [ ] Test is organized in appropriate `describe()` block
- [ ] Page object extends `BasePage`
- [ ] Locators are readonly properties initialized in constructor
- [ ] Methods follow naming convention (fill*, click*, verify*)
- [ ] Tests use explicit waits, not hard sleeps
- [ ] Test data is generated dynamically (timestamps, random IDs)
- [ ] Related page objects are exported in `index.ts`
- [ ] No brittle selectors (nth-child, deeply nested paths)
- [ ] Test is independent and can run in any order
- [ ] Error cases are tested
- [ ] Comments explain complex test logic
- [ ] Test runs successfully and is reliable

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Locator Best Practices](https://playwright.dev/docs/locators)
