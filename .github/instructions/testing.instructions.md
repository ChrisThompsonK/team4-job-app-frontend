# Testing Instructions - LLM Context Guide

> **Important**: This document provides guidelines for running tests and viewing test reports for both Playwright (E2E) and Cucumber (BDD) testing frameworks.

## Overview

This project uses two complementary testing approaches:

1. **Playwright** - End-to-end (E2E) testing framework for browser automation
2. **Cucumber** - Behavior-driven development (BDD) testing with Gherkin syntax

Both frameworks are configured to generate HTML reports that can be easily viewed after test runs.

---

## Test Setup & Installation

### Dependencies
All testing dependencies are listed in `package.json`:
- `@playwright/test` - E2E testing framework
- `@cucumber/cucumber` - BDD testing framework
- `@cucumber/pretty-formatter` - HTML report formatter

### Install Dependencies
```bash
npm install
```

---

## Playwright Testing

### Purpose
Playwright tests verify end-to-end user flows by:
- Automating browser interactions
- Testing against real frontend and backend services
- Validating UI elements, navigation, and form submissions
- Checking error handling and edge cases

### Test Location
```
tests/e2e/         # Playwright test files (*.spec.ts)
playwright-report/ # Generated HTML reports (auto-created after test run)
```

### Configuration
**File**: `playwright.config.ts`

Key settings:
- **Test Directory**: `tests/e2e/`
- **Reporter**: HTML (default)
- **Screenshot**: Captured on failure only
- **Video**: Retained on failure only
- **Trace**: Enabled on first retry for debugging
- **Base URL**: `http://localhost:3000`

### Running Playwright Tests

#### Run All Tests
```bash
npm run test:pw
```
This command:
- Starts the development server
- Runs all Playwright tests
- Generates HTML report automatically
- Outputs results to `playwright-report/`

#### Run Tests with UI
```bash
npm run test:pw:ui
```
Interactive UI mode for:
- Step-by-step test execution
- Live browser viewing
- Debugging and inspection
- Test filtering

#### Run Specific Test File
```bash
npx playwright test tests/e2e/specific-test.spec.ts
```

#### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

#### Run Tests in Debug Mode
```bash
npx playwright test --debug
```
Opens Playwright Inspector for step-by-step debugging.

### Viewing Playwright Reports

#### Automatic Report Generation
After running `npm run test:pw`, the HTML report is generated at:
```
playwright-report/index.html
```

#### View Report
```bash
npx playwright show-report
```

Or manually open:
```bash
open playwright-report/index.html
```

#### Report Contents
The HTML report includes:
- Test results summary (passed/failed/skipped)
- Individual test details with:
  - Test name and duration
  - Pass/fail status
  - Screenshots on failure
  - Video recordings on failure
  - Trace files for debugging
- Browser and OS information
- Execution timeline

#### Trace Viewer
To inspect detailed execution traces:
```bash
npx playwright show-trace <trace-file>
```

Example:
```bash
npx playwright show-trace playwright-report/trace/<trace-file>.zip
```

---

## Cucumber Testing

### Purpose
Cucumber tests verify application behavior using natural language Gherkin syntax:
- Write tests in human-readable format (Given/When/Then)
- Bridge communication between developers and stakeholders
- Test business workflows and acceptance criteria
- Provide living documentation of system behavior

### Test Location
```
tests/bdd/
├── features/         # Gherkin feature files (*.feature)
├── steps/            # Step implementations (*.ts)
└── reports/          # Generated HTML reports (auto-created after test run)
```

### Configuration
**File**: `cucumber.cjs`

Configuration:
```javascript
module.exports = {
  default: {
    require: ["tests/bdd/steps/**/*.ts"],           // Step definitions
    requireModule: ["tsx"],                         // TypeScript support
    format: [
      "progress-bar",                              // Console output
      "html:tests/bdd/reports/cucumber-report.html" // HTML report
    ]
  }
};
```

### Writing Cucumber Tests

#### Feature File Example
**File**: `tests/bdd/features/login.feature`

```gherkin
Feature: User Login
  Background:
    Given the application is running

  Scenario: Successful login with valid credentials
    When I navigate to the login page
    And I enter valid credentials
    And I click the login button
    Then I should be redirected to the jobs page
    And I should see a success message

  Scenario: Failed login with invalid credentials
    When I navigate to the login page
    And I enter invalid credentials
    And I click the login button
    Then I should see an error message
    And I should remain on the login page
```

#### Step Definitions Example
**File**: `tests/bdd/steps/login.steps.ts`

```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

Given("the application is running", async function () {
  // Setup code
});

When("I navigate to the login page", async function () {
  // Implementation
});

Then("I should see a success message", async function () {
  // Assertion
});
```

### Running Cucumber Tests

#### Run All Tests
```bash
npm run test:bdd
```
This command:
- Executes all feature files
- Generates HTML report automatically
- Outputs progress to console

#### Run Tests in Watch Mode
```bash
npm run test:bdd:watch
```
Automatically re-runs tests when feature or step files change.

#### Run Specific Feature File
```bash
npx cucumber-js tests/bdd/features/login.feature
```

#### Run with Specific Tags
```bash
npx cucumber-js --tags "@critical"
```

### Viewing Cucumber Reports

#### Automatic Report Generation
After running `npm run test:bdd`, the HTML report is generated at:
```
tests/bdd/reports/cucumber-report.html
```

#### View Report
```bash
open tests/bdd/reports/cucumber-report.html
```

Or use a browser:
```bash
npx http-server tests/bdd/reports/
```

#### Report Contents
The HTML report includes:
- Feature summary (passed/failed/pending)
- Scenario breakdown with:
  - Gherkin syntax (Feature, Scenario, Steps)
  - Pass/fail status
  - Execution duration
  - Error messages and stack traces
- Step-by-step execution timeline
- Tags and scenario descriptions

---

## Running All Tests

### Run All Tests (Playwright + Cucumber)
```bash
npm run test:pw && npm run test:bdd
```

### Run Tests and View Reports
```bash
# Playwright
npm run test:pw && npx playwright show-report

# Cucumber
npm run test:bdd && open tests/bdd/reports/cucumber-report.html
```

---

## Test Workflow

### Before Running Tests

1. **Start Backend** (if testing requires API):
   ```bash
   # In backend directory
   npm run dev
   ```

2. **Verify Environment**:
   - Check `.env` file for correct configuration
   - Verify `PORT=3000` (frontend)
   - Verify `API_BASE_URL=http://localhost:8080` (or your backend URL)

3. **Optional: Start Mock Backend**:
   ```bash
   npm run mock:backend
   ```

### During Test Execution

- **Do not close** terminal or browser windows
- Monitor console output for errors
- Watch for test progress indicators
- Check for screenshot/video captures

### After Test Execution

1. **View Reports**:
   ```bash
   # Playwright
   npx playwright show-report

   # Cucumber
   open tests/bdd/reports/cucumber-report.html
   ```

2. **Analyze Failures**:
   - Check screenshots for visual issues
   - Review video recordings for interaction details
   - Inspect trace files for step-by-step execution
   - Read error messages and stack traces

3. **Debug Failed Tests**:
   - Use `--debug` flag for interactive debugging
   - Re-run specific tests with `--headed` mode
   - Check browser console in playwright ui

---

## Debugging Tests

### Playwright Debugging

#### Enable Headed Mode
```bash
npx playwright test --headed
```
Shows browser window during execution.

#### Interactive Debug Mode
```bash
npx playwright test --debug
```
Opens Playwright Inspector with:
- Step-by-step execution control
- DOM inspection
- Console access
- Network requests

#### Enable Tracing for Specific Tests
Add to test:
```typescript
test("example", async ({ page }) => {
  await page.context().tracing.start({ screenshots: true, snapshots: true });
  // test code
  await page.context().tracing.stop({ path: "trace.zip" });
});
```

### Cucumber Debugging

#### View Step Definitions
```bash
npx cucumber-js --dry-run
```
Shows all recognized steps without executing them.

#### Enable Debug Logging
```bash
DEBUG=cucumber-js npm run test:bdd
```

#### Pause on Failure
Add to step:
```typescript
import { Then, setDefaultTimeout } from "@cucumber/cucumber";
setDefaultTimeout(60 * 1000); // Increase timeout

Then("debug step", async function () {
  await page.pause(); // Opens DevTools for inspection
});
```

---

## Continuous Integration (CI)

### CI Configuration
For GitHub Actions or similar CI environments:

```yaml
- name: Run Playwright Tests
  run: npm run test:pw

- name: Run Cucumber Tests
  run: npm run test:bdd

- name: Upload Test Reports
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30

- name: Upload Cucumber Report
  uses: actions/upload-artifact@v3
  with:
    name: cucumber-report
    path: tests/bdd/reports/
    retention-days: 30
```

### CI Adjustments
The config automatically detects CI environment (`process.env.CI`):
- **Retries**: 2 retries in CI, 0 in local
- **Workers**: 1 worker in CI, parallel in local
- **Forbid Only**: Fails if `test.only` found in CI

---

## Common Issues & Solutions

### Playwright Issues

| Issue | Solution |
|-------|----------|
| **Tests timeout** | Increase timeout in playwright.config.ts: `timeout: 30000` |
| **Cannot reach localhost:3000** | Ensure dev server is running: `npm run dev` |
| **Screenshots/videos not captured** | Check `screenshot` and `video` settings in config |
| **Trace files too large** | Disable tracing or set `trace: "on-first-retry"` |
| **Tests fail in CI but pass locally** | Check for hardcoded paths, time-dependent tests, or OS differences |

### Cucumber Issues

| Issue | Solution |
|-------|----------|
| **Steps not found** | Verify step files in `tests/bdd/steps/` are imported in `cucumber.cjs` |
| **Wrong parameter passing** | Use regex capturing groups: `Given('I have {int} items', ...)` |
| **Hooks not running** | Use `@Before` and `@After` from `@cucumber/cucumber` |
| **Reports not generated** | Check file path in `cucumber.cjs`: `html:tests/bdd/reports/` |
| **Feature files not found** | Default path is `features/` - use absolute paths if needed |

### Report Viewing Issues

| Issue | Solution |
|-------|----------|
| **HTML report won't open** | Try: `npx playwright show-report` or `npx http-server playwright-report/` |
| **Report is blank** | Re-run tests to regenerate: `npm run test:pw` |
| **Screenshots/videos not showing** | Check `screenshot` and `video` settings are enabled |
| **Old report still showing** | Delete `playwright-report/` and re-run tests |

---

## Best Practices

### Writing Tests

1. **Use Descriptive Names**
   ```typescript
   ✓ test("should display error message when login fails")
   ✗ test("login test")
   ```

2. **Follow AAA Pattern** (Arrange, Act, Assert)
   ```typescript
   test("example", async ({ page }) => {
     // Arrange - setup
     await page.goto("/login");
     
     // Act - perform action
     await page.fill('input[name="email"]', "test@example.com");
     
     // Assert - verify
     await expect(page).toHaveTitle("Login");
   });
   ```

3. **Use Page Object Model** (for complex tests)
   ```typescript
   class LoginPage {
     constructor(private page: Page) {}
     
     async login(email: string, password: string) {
       await this.page.fill('input[name="email"]', email);
       await this.page.fill('input[name="password"]', password);
       await this.page.click("button[type='submit']");
     }
   }
   ```

4. **Isolate Tests**
   - Don't rely on test execution order
   - Clean up state after each test
   - Use fresh browser context per test

### Maintaining Tests

1. **Use Data-Driven Tests** for multiple scenarios
2. **Add Timeouts** for async operations: `await page.waitForSelector(".element", { timeout: 5000 })`
3. **Mock External APIs** to avoid flakiness
4. **Document Complex Steps** with comments
5. **Review Reports Regularly** to catch patterns in failures

---

## Report Storage & Cleanup

### Report Locations
```
playwright-report/          # Playwright HTML report
tests/bdd/reports/          # Cucumber HTML report
test-results/               # Detailed test result files
```

### Cleanup Old Reports
```bash
# Remove all reports
rm -rf playwright-report/ tests/bdd/reports/ test-results/

# Or selectively
rm -rf playwright-report/
npm run test:pw             # Regenerate
```

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| Run Playwright tests | `npm run test:pw` |
| Run Playwright with UI | `npm run test:pw:ui` |
| View Playwright report | `npx playwright show-report` |
| Run Cucumber tests | `npm run test:bdd` |
| Run Cucumber watch mode | `npm run test:bdd:watch` |
| View Cucumber report | `open tests/bdd/reports/cucumber-report.html` |
| Run all tests | `npm run test:pw && npm run test:bdd` |
| Debug Playwright test | `npx playwright test --debug` |
| Headed mode (see browser) | `npx playwright test --headed` |
| Run specific test file | `npx playwright test tests/e2e/specific.spec.ts` |

---

## Integration with Development

### Development Workflow

1. **Write/modify feature or step files**
2. **Run tests in watch mode**:
   ```bash
   npm run test:bdd:watch    # Cucumber watch mode
   # OR
   npm run test:pw:ui        # Playwright UI mode
   ```
3. **View live feedback** as code changes
4. **Check reports** after successful runs

### Pre-Commit Hook (Optional)

Add to `.git/hooks/pre-commit`:
```bash
npm run test:pw || exit 1
npm run test:bdd || exit 1
```

---

## Resources & Documentation

- **Playwright**: https://playwright.dev/docs/intro
- **Playwright API**: https://playwright.dev/docs/api/class-playwright
- **Cucumber.js**: https://github.com/cucumber/cucumber-js
- **Gherkin Syntax**: https://cucumber.io/docs/gherkin/
- **Trace Viewer**: https://trace.playwright.dev/

---

**Last Updated**: November 6, 2025
