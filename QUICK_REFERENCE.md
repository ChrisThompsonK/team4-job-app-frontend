# Page Object Model - Quick Reference Card

## Import Page Objects
```typescript
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { JobsPage } from './pages/JobsPage';
```

---

## BasePage Methods (All Pages Inherit These)

```typescript
const page = new HomePage(page);

// Navigation
await page.goto('/path');                    // Go to URL path
page.getCurrentURL();                        // Get current URL
await page.getPageTitle();                   // Get page title
await page.waitForPageLoad();                // Wait for network idle

// Element Interaction
await page.fillInput('selector', 'text');    // Fill input field
await page.click('selector');                // Click element
await page.getText('selector');              // Get element text
await page.isElementVisible('selector');     // Check visibility

// Utilities
await page.takeScreenshot('path.png');       // Screenshot
await page.verifyURLContains('text');        // URL contains check
await page.waitForElementVisible('selector'); // Wait for element
```

---

## LoginPage Quick Reference

```typescript
const loginPage = new LoginPage(page);

// Complete Actions
await loginPage.navigateToLogin();           // Go to /login
await loginPage.login(email, password);      // Full login flow

// Individual Steps
await loginPage.enterEmail('user@test.com');
await loginPage.enterPassword('password123');
await loginPage.clickLoginButton();

// Verification
await loginPage.isLoginPageDisplayed();      // Is on login page
await loginPage.isEmailInputVisible();       // Email field visible
await loginPage.isPasswordInputVisible();    // Password field visible
await loginPage.getErrorMessage();           // Get error text
```

---

## RegisterPage Quick Reference

```typescript
const registerPage = new RegisterPage(page);

// Complete Actions
await registerPage.navigateToRegister();     // Go to /register
await registerPage.register(
    'John', 'Doe',
    'john@test.com',
    'password123',
    'password123'
);

// Individual Steps
await registerPage.enterFirstName('John');
await registerPage.enterLastName('Doe');
await registerPage.enterEmail('john@test.com');
await registerPage.enterPassword('password123');
await registerPage.enterConfirmPassword('password123');
await registerPage.clickCreateAccountButton();

// Verification
await registerPage.isRegisterPageDisplayed();
await registerPage.getErrorMessage();
```

---

## HomePage Quick Reference

```typescript
const homePage = new HomePage(page);

// Navigation
await homePage.navigateToHome();             // Go to home /
await homePage.clickJobsLink();              // Navigate to jobs
await homePage.clickProfileLink();           // Navigate to profile
await homePage.clickLoginLink();             // Navigate to login
await homePage.clickRegisterLink();          // Navigate to register
await homePage.clickLogout();                // Logout

// Verification
await homePage.isHomePageDisplayed();        // Home page visible
await homePage.isUserLoggedIn();             // User logged in
await homePage.isUserLoggedOut();            // User logged out
await homePage.getJobCardsCount();           // Count of job cards
await homePage.getPageHeadingText();         // Get heading text
```

---

## JobsPage Quick Reference

```typescript
const jobsPage = new JobsPage(page);

// Navigation
await jobsPage.navigateToJobs();             // Go to /jobs

// Search & Filter
await jobsPage.searchForJobs('Developer');   // Search by keyword
await jobsPage.filterByLocation(1);          // Filter by location
await jobsPage.filterByCapability(1);        // Filter by capability

// Job Interactions
await jobsPage.clickFirstJob();              // Click first job
await jobsPage.clickJobAtIndex(2);           // Click job at index
await jobsPage.clickNextButton();            // Next page
await jobsPage.clickPreviousButton();        // Previous page

// Verification
await jobsPage.isJobsPageDisplayed();        // Jobs page visible
await jobsPage.getJobItemsCount();           // Count of jobs
await jobsPage.getJobTitles();               // Array of job titles
await jobsPage.hasNextButton();              // Next button exists
await jobsPage.hasPreviousButton();          // Prev button exists
```

---

## Test Examples

### Example 1: Login Test
```typescript
test('User can login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    
    await loginPage.login('user@test.com', 'password123');
    
    expect(await homePage.isUserLoggedIn()).toBeTruthy();
});
```

### Example 2: Registration Test
```typescript
test('User can register', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    await registerPage.register(
        'John', 'Doe',
        `user${Date.now()}@test.com`,
        'TestPassword123!',
        'TestPassword123!'
    );
    
    const url = registerPage.getCurrentURL();
    expect(url).not.toContain('/register');
});
```

### Example 3: Navigation Test
```typescript
test('User can navigate to jobs', async ({ page }) => {
    const homePage = new HomePage(page);
    const jobsPage = new JobsPage(page);
    
    await homePage.navigateToHome();
    await homePage.clickJobsLink();
    
    expect(await jobsPage.isJobsPageDisplayed()).toBeTruthy();
});
```

### Example 4: Search Test
```typescript
test('User can search jobs', async ({ page }) => {
    const jobsPage = new JobsPage(page);
    
    await jobsPage.navigateToJobs();
    const initialCount = await jobsPage.getJobItemsCount();
    
    await jobsPage.searchForJobs('Developer');
    const searchCount = await jobsPage.getJobItemsCount();
    
    expect(searchCount).toBeGreaterThanOrEqual(0);
});
```

---

## Common Patterns

### Pattern 1: Complete User Flow
```typescript
test('Complete flow', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const homePage = new HomePage(page);
    const jobsPage = new JobsPage(page);
    
    // Register
    await registerPage.register('John', 'Doe', 'john@test.com', 'pwd', 'pwd');
    
    // Browse jobs
    await homePage.navigateToHome();
    const jobCount = await homePage.getJobCardsCount();
    expect(jobCount).toBeGreaterThan(0);
    
    // Go to jobs page
    await homePage.clickJobsLink();
    expect(await jobsPage.isJobsPageDisplayed()).toBeTruthy();
});
```

### Pattern 2: Verification Pattern
```typescript
test('Page state verification', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.navigateToHome();
    
    // Multiple verifications
    expect(await homePage.isHomePageDisplayed()).toBeTruthy();
    expect(await homePage.isUserLoggedOut()).toBeTruthy();
    expect(await homePage.getJobCardsCount()).toBeGreaterThan(0);
});
```

### Pattern 3: Error Handling
```typescript
test('Error message verification', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.enterEmail('invalid@test.com');
    await loginPage.enterPassword('wrongpassword');
    await loginPage.clickLoginButton();
    
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toBeTruthy();
});
```

---

## Best Practices Checklist

✅ Always initialize page object with `new PageClass(page)`
✅ Use descriptive method names that describe user actions
✅ Chain multiple methods for complete workflows
✅ Use descriptive variable names (e.g., `jobCount` not `count`)
✅ Add `await` for all async operations
✅ Verify page state before interactions
✅ Use specific assertions (not just `.toBeTruthy()`)
✅ Add comments for complex test logic
✅ Keep tests focused on single user workflow
✅ Use fixtures for test data generation

---

## Running Tests

```bash
# Run all tests
npm run test:e2e:headed

# Run specific file
npm run test:e2e:headed -- tests/pom.spec.ts

# Run specific test
npm run test:e2e:headed -- tests/pom.spec.ts -g "Registration"

# Run with debugging
npm run test:e2e:debug

# Run headless (CI mode)
npm run test:e2e
```

---

## Useful Selectors Reference

```typescript
// Text selectors
'button:has-text("Login")'                   // Button with text
'a:has-text("Sign up")'                      // Link with text
'text=Exact text here'                       // Exact text match

// Input selectors
'input[name="email"]'                        // By name attribute
'input[type="password"]'                     // By type
'input[placeholder*="Search"]'               // By placeholder

// Attribute selectors
'button[class*="btn"]'                       // Contains class
'a[href*="/jobs"]'                           // Contains href
'[role="article"]'                           // By ARIA role

// Complex selectors
'div >> button'                              // Descendant
'text=/Developer|Manager/'                   // Regex match
'nth=0'                                      // By index
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Test times out | Add `await page.waitForPageLoad()` |
| Element not found | Check selector with browser DevTools |
| Flaky test | Use explicit waits instead of `setTimeout` |
| Navigation doesn't work | Verify URL with `page.getCurrentURL()` |
| Form submission fails | Check form validation errors |

---

For detailed information, see **POM_GUIDE.md** in the tests directory.
