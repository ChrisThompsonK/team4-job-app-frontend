# Cucumber BDD Tests

This directory contains Behavior-Driven Development (BDD) test specifications using Cucumber and Playwright.

## Structure

```
tests/bdd/
├── features/           # Gherkin feature files
│   ├── admin-login.feature
│   ├── member-login.feature
│   └── view-jobs.feature
├── steps/              # Step definitions (TypeScript)
│   └── steps.ts
└── reports/            # Test reports (generated)
```

## Features

### Admin Login (`admin-login.feature`)
- **Admin logs in with valid credentials** - Verifies successful admin authentication
- **Admin sees error with invalid credentials** - Verifies error handling for failed login

### Member Login (`member-login.feature`)
- **Member logs in with valid credentials** - Verifies successful member authentication
- **Member cannot log in without password** - Verifies required field validation

### View Jobs (`view-jobs.feature`)
- **User views all jobs** - Verifies job listing page functionality
- **User views job details** - Verifies individual job detail page

## Running Tests

### Run all Cucumber tests
```bash
npm run test:bdd
```

### Run tests in watch mode
```bash
npm run test:bdd:watch
```

### Generate HTML report
Reports are automatically generated at `tests/bdd/reports/cucumber-report.html` after test runs.

## Prerequisites

- Application must be running on `http://localhost:3000`
- Backend API must be accessible at `http://localhost:3001`
- Dependencies: `@cucumber/cucumber`, `@playwright/test`

## Writing New Tests

### 1. Create a Feature File
Create a `.feature` file in `tests/bdd/features/` using Gherkin syntax:

```gherkin
Feature: Feature Name
  As a [user role]
  I want to [action]
  So that [benefit]

  Scenario: Scenario description
    Given [initial state]
    When [action taken]
    Then [expected result]
```

### 2. Implement Step Definitions
Add corresponding step definitions in `tests/bdd/steps/steps.ts`:

```typescript
Given("I am on the [page] page", async function () {
  // Implementation
});
```

### 3. Test Locators
Use these common selectors:
- Form inputs: `input[name="fieldName"]`
- Buttons: `button:has-text("Button Text")`
- Links: `a:has-text("Link Text")`
- Error messages: `[role="alert"]:has-text("Error")`

## Best Practices

✅ **Do:**
- Keep scenarios simple and focused on one behavior
- Use descriptive Given/When/Then statements
- Reuse step definitions across scenarios
- Use data tables for multiple test cases

❌ **Don't:**
- Create overly complex scenarios
- Hard-code timeouts
- Test implementation details instead of behavior
- Mix multiple features in one scenario

## Troubleshooting

### Steps not found
Ensure step definitions in `steps.ts` match the feature file language exactly.

### Timeouts
Increase timeout in `steps.ts`:
```typescript
setDefaultTimeout(60 * 1000); // 60 seconds
```

### Browser not launching
Verify that:
- Application is running on port 3000
- Backend is accessible
- Chrome/Chromium browser is installed

## Configuration

Cucumber configuration is in `cucumber.cjs`:
- Test files: `tests/bdd/features/**/*.feature`
- Step definitions: `tests/bdd/steps/**/*.ts`
- Reports: HTML format at `tests/bdd/reports/`

## References

- [Cucumber.js Documentation](https://github.com/cucumber/cucumber-js)
- [Playwright Documentation](https://playwright.dev)
- [Gherkin Language](https://cucumber.io/docs/gherkin/reference/)
