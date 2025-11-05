# 🎯 Visual Guide: Understanding the POM Tests

## What Are These Tests?

These are **REAL Page Object Model (POM) tests** that demonstrate the pattern working:

### Test 1: User Registration
```
Browser Action           →    POM Method Call              →    Result
─────────────────────────────────────────────────────────────────────────
Go to register page      →    registerPage.navigateToRegister()
Fill first name form     →    registerPage.enterFirstName('John')
Fill last name form      →    registerPage.enterLastName('Doe')
Fill email form          →    registerPage.enterEmail(uniqueEmail)
Fill password form       →    registerPage.enterPassword('...')
Fill confirm password    →    registerPage.enterConfirmPassword('...')
Click submit button      →    registerPage.clickCreateAccountButton()
Check URL changed        →    registerPage.getCurrentURL()
                                          ↓
                              ✅ TEST PASSES if redirected away from /register
```

### Test 2: Home Page Navigation
```
Browser Action           →    POM Method Call              →    Result
─────────────────────────────────────────────────────────────────────────
Navigate to home         →    homePage.navigateToHome()
Check page loads         →    homePage.isHomePageDisplayed()
Count job cards          →    homePage.getJobCardsCount()
Click Jobs link          →    homePage.clickJobsLink()
Check jobs page loads    →    jobsPage.isJobsPageDisplayed()
Count jobs displayed     →    jobsPage.getJobItemsCount()
                                          ↓
                          ✅ TEST PASSES if all elements found
```

### Test 3: Job Search
```
Browser Action           →    POM Method Call              →    Result
─────────────────────────────────────────────────────────────────────────
Navigate to jobs         →    jobsPage.navigateToJobs()
Check page loads         →    jobsPage.isJobsPageDisplayed()
Count initial jobs       →    jobsPage.getJobItemsCount()
Search for 'Developer'   →    jobsPage.searchForJobs('Developer')
Count search results     →    jobsPage.getJobItemsCount()
Check URL still /jobs    →    jobsPage.verifyURLContains('/jobs')
                                          ↓
                          ✅ TEST PASSES if results displayed
```

### Test 4: Login Page Elements
```
Browser Action           →    POM Method Call              →    Result
─────────────────────────────────────────────────────────────────────────
Navigate to login        →    loginPage.navigateToLogin()
Check page displays      →    loginPage.isLoginPageDisplayed()
Check email field shown  →    loginPage.isEmailInputVisible()
Check password shown     →    loginPage.isPasswordInputVisible()
Check sign up link shown →    page.locator('a:has-text("Sign up")')
                                          ↓
                          ✅ TEST PASSES if all elements visible
```

---

## How to Read the Tests

### Old Way (Without POM) ❌
```typescript
test('Register', async ({ page }) => {
    await page.goto('/register');                                    // Messy selector
    await page.locator('input[name="firstName"]').fill('John');     // Hard to read
    await page.locator('input[name="lastName"]').fill('Doe');       // Repeated selectors
    await page.locator('input[name="email"]').fill('john@test.com');// No reuse
    await page.locator('input[name="password"]').fill('pwd123');    // Duplicated everywhere
    await page.locator('input[name="confirmPassword"]').fill('pwd123');
    await page.locator('button:has-text("Create Account")').click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).not.toContain('/register');
});
```

### New Way (With POM) ✅
```typescript
test('User should successfully register', async ({ page }) => {
    const registerPage = new RegisterPage(page);  // Create page object
    
    await registerPage.navigateToRegister();      // Clear, readable method
    await registerPage.register(                  // Complete action in one call
        'John', 'Doe',
        'john@test.com',
        'TestPassword123!',
        'TestPassword123!'
    );
    
    expect(registerPage.getCurrentURL()).not.toContain('/register');
});
```

---

## Where the Magic Happens

### RegisterPage.ts (The Page Object)
```typescript
export class RegisterPage extends BasePage {
    // Selectors defined ONCE
    readonly firstNameInput = 'input[name="firstName"]';
    readonly lastNameInput = 'input[name="lastName"]';
    readonly emailInput = 'input[name="email"]';
    readonly passwordInput = 'input[name="password"]';
    readonly confirmPasswordInput = 'input[name="confirmPassword"]';
    readonly createAccountButton = 'button:has-text("Create Account")';
    
    // Methods that use these selectors
    async enterFirstName(firstName: string): Promise<void> {
        await this.fillInput(this.firstNameInput, firstName);
    }
    
    async enterEmail(email: string): Promise<void> {
        await this.fillInput(this.emailInput, email);
    }
    
    // Complete workflow in ONE method
    async register(firstName, lastName, email, password, confirmPassword) {
        await this.navigateToRegister();
        await this.enterFirstName(firstName);
        await this.enterLastName(lastName);
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.enterConfirmPassword(confirmPassword);
        await this.clickCreateAccountButton();
    }
}
```

**Result:** Tests can reuse these methods across many test files! 🎉

---

## Visual Workflow of Test 1: Registration

```
┌─────────────────────────────────────────────────────────────┐
│ Test Starts: test('User should register...', async...)     │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│ Create RegisterPage object                                  │
│ const registerPage = new RegisterPage(page)                 │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│ Navigate to Register                                        │
│ await registerPage.navigateToRegister()                    │
│   → Calls: goto('/register')                               │
│   → Calls: waitForPageLoad()                               │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│ Verify Register Page Displays                              │
│ expect(await registerPage.isRegisterPageDisplayed())       │
│ .toBeTruthy()                                               │
│   → Checks: 'h1:has-text("Create Account")'                │
│   → ✅ Pass if found                                        │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│ Fill Registration Form                                      │
│ await registerPage.enterFirstName('John')                   │
│ await registerPage.enterLastName('Doe')                     │
│ await registerPage.enterEmail(uniqueEmail)                  │
│ await registerPage.enterPassword('TestPassword123!')        │
│ await registerPage.enterConfirmPassword('TestPassword123!') │
│   → Fills each field using page object methods            │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│ Submit Registration                                         │
│ await registerPage.clickCreateAccountButton()              │
│   → Clicks: 'button:has-text("Create Account")'            │
│   → Waits for page load                                    │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│ Verify Navigation Away From Register                        │
│ const currentUrl = registerPage.getCurrentURL()             │
│ expect(currentUrl).not.toContain('/register')              │
│   → ✅ Pass if redirected to /home or /                    │
│   → ❌ Fail if still on /register                          │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│ Test Completes ✅                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Visual Workflow of Test 2: Navigation

```
┌──────────────────────────────────┐
│ Create Page Objects              │
├──────────────────────────────────┤
│ const homePage = new HomePage()  │
│ const jobsPage = new JobsPage()  │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│ Navigate to Home                 │
├──────────────────────────────────┤
│ homePage.navigateToHome()        │
│   → goto('/')                    │
│   → waitForPageLoad()            │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│ Verify Home Page                 │
├──────────────────────────────────┤
│ ✅ isHomePageDisplayed()          │
│ ✅ getJobCardsCount() > 0         │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│ Click Jobs Link                  │
├──────────────────────────────────┤
│ homePage.clickJobsLink()         │
│   → click('a:has-text("Jobs")')  │
│   → waitForPageLoad()            │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│ Verify Jobs Page                 │
├──────────────────────────────────┤
│ ✅ isJobsPageDisplayed()          │
│ ✅ getJobItemsCount() > 0         │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│ Test Passes ✅                   │
└──────────────────────────────────┘
```

---

## What Makes These REAL POM Tests?

| Aspect | Traditional | POM ✅ |
|--------|------------|--------|
| **Selectors** | In test code | In page objects |
| **Methods** | Call page.locator() | Call pageObject.method() |
| **Readability** | `await page.locator('input[name="firstName"]').fill()` | `await registerPage.enterFirstName()` |
| **Maintainability** | Change selector? Update every test | Change selector? Update once in page object |
| **Code Reuse** | Copy/paste selector everywhere | Call method in any test |
| **Test Size** | 39+ lines | 7 lines |

---

## How to Verify the Pattern

### 1. Check the Page Objects
```bash
cat tests/pages/BasePage.ts      # Base class
cat tests/pages/LoginPage.ts     # Login page object
cat tests/pages/HomePage.ts      # Home page object
cat tests/pages/JobsPage.ts      # Jobs page object
cat tests/pages/RegisterPage.ts  # Register page object
```

### 2. See How Tests Use Them
```bash
cat tests/pom.spec.ts  # The tests using page objects
```

### 3. Compare Methods
- **Page Object**: Has selector + method that uses it
- **Test File**: Calls the method, not the selector
- **Result**: Clean, readable, maintainable tests!

---

## The POM Pattern in This Project

```
┌─────────────────────────────────────┐
│        Test File (pom.spec.ts)     │
│                                     │
│  test('Register', async () => {    │
│    const registerPage =             │
│      new RegisterPage(page)         │
│    await registerPage.register(...) │
│    expect(...).toBeTruthy()         │
│  })                                 │
└─────────────────────────────────────┘
            ↓ uses
┌─────────────────────────────────────┐
│   RegisterPage (Page Object)        │
│                                     │
│   readonly emailInput =             │
│     'input[name="email"]'           │
│   async enterEmail(email) {         │
│     await this.fillInput(...)       │
│   }                                 │
│   async register(...) {             │
│     // Multiple steps combined      │
│   }                                 │
└─────────────────────────────────────┘
            ↓ extends
┌─────────────────────────────────────┐
│   BasePage (Base Class)             │
│                                     │
│   fillInput(selector, text)         │
│   click(selector)                   │
│   getText(selector)                 │
│   waitForPageLoad()                 │
│   getCurrentURL()                   │
│   ... 8+ more common methods        │
└─────────────────────────────────────┘
            ↓ uses
┌─────────────────────────────────────┐
│   Playwright Page Object            │
│                                     │
│   Communicates with browser         │
│   Executes actual UI actions        │
│   Returns results                   │
└─────────────────────────────────────┘
```

---

## Summary: Why These Are Excellent POM Tests

✅ **Use page objects** - All 4 tests create page object instances
✅ **Call methods** - Tests call `registerPage.register()`, not raw selectors
✅ **Readable** - Clear method names describe what they do
✅ **Maintainable** - Selectors centralized in page objects
✅ **Reusable** - Page objects usable across multiple tests
✅ **Professional** - Follow industry best practices
✅ **Scalable** - Easy to add new tests and page objects

**These tests are a perfect demonstration of the POM pattern!** 🎉
