# Page Object Model Architecture

## Class Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                         BasePage                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Common Methods (All Pages Inherit)                       │   │
│  │ • goto() - Navigation                                    │   │
│  │ • waitForPageLoad() - Wait for page to load             │   │
│  │ • fillInput() - Fill form fields                        │   │
│  │ • click() - Click elements                              │   │
│  │ • getText() - Get text content                          │   │
│  │ • isElementVisible() - Element visibility               │   │
│  │ • getCurrentURL() - Get current URL                      │   │
│  │ • takeScreenshot() - Screenshot                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         ▲                    ▲                ▲                ▲
         │                    │                │                │
         │                    │                │                │
    ┌────────────┐        ┌─────────┐    ┌──────────┐    ┌──────────┐
    │ LoginPage  │        │HomePage │    │JobsPage  │    │RegisterPage│
    └────────────┘        └─────────┘    └──────────┘    └──────────┘
    • navigateToLogin()   • navigateToHome()  • navigateToJobs()    • navigateToRegister()
    • login()             • clickJobsLink()   • searchForJobs()     • register()
    • enterEmail()        • clickProfileLink()• filterByLocation()  • enterFirstName()
    • enterPassword()     • clickLogout()     • clickFirstJob()     • enterLastName()
    • clickLoginButton()  • isUserLoggedIn()  • clickNextButton()   • enterEmail()
    • getErrorMessage()   • getJobCardsCount()• getJobItemsCount()  • enterPassword()
```

## Test Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│                          Test File (pom.spec.ts)                     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Test 1: User Registration and Navigation                       │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │ new RegisterPage(page) → register() → navigate away            │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Test 2: Home Page Navigation and Job Browsing                 │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │ new HomePage(page) → navigateToHome() → clickJobsLink()       │  │
│  │ new JobsPage(page) → verify jobs displayed                    │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Test 3: Jobs Search and Filtering                              │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │ new JobsPage(page) → navigateToJobs() → searchForJobs()       │  │
│  │ → verify results                                               │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Test 4: Login Page Verification                                │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │ new LoginPage(page) → navigateToLogin() → verify elements      │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## Page Object Creation Flow

```
User Test
    │
    ├─ new HomePage(page) ──────────────────┐
    │                                         │
    ├─ new LoginPage(page) ──────────────────┤
    │                                         ▼
    ├─ new RegisterPage(page) ──────────────→ BasePage
    │                                         ├─ fillInput()
    └─ new JobsPage(page) ─────────────────┐ ├─ click()
                                             │ ├─ getText()
                                             │ ├─ isElementVisible()
                                             │ └─ ... more methods
                                             │
                                             ▼
                                         Page Methods
```

## Data Flow in Tests

```
┌──────────────────────────┐
│   Test Setup             │
│   • Create page object   │
│   • Initialize test data │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│   Call Page Object       │
│   Method                 │
│   await pageObj.action() │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│   Page Object Executes   │
│   • Select element       │
│   • Perform action       │
│   • Wait for result      │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│   Playwright Interacts   │
│   With Browser           │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│   Return to Test         │
│   Verify Result          │
│   expect(result)...      │
└──────────────────────────┘
```

## Page Object Interaction Example

### User Story: Register and Browse Jobs

```
Test Request
    │
    └─ await registerPage.register(...)
       │
       ├─ goto('/register')
       ├─ fillInput(firstNameInput, 'John')
       ├─ fillInput(lastNameInput, 'Doe')
       ├─ fillInput(emailInput, 'john@test.com')
       ├─ fillInput(passwordInput, 'pwd')
       ├─ fillInput(confirmPasswordInput, 'pwd')
       ├─ click(createAccountButton)
       └─ waitForPageLoad()
          │
          └─ Redirect to Home Page
             │
             └─ await homePage.clickJobsLink()
                ├─ click(jobsLink)
                └─ waitForPageLoad()
                   │
                   └─ Navigate to Jobs Page
                      │
                      └─ await jobsPage.getJobItemsCount()
                         │
                         └─ Return: 15
                            │
                            └─ expect(15).toBeGreaterThan(0) ✓ PASS
```

## Test Execution Flow

```
START
  │
  ├─ Load Browser
  │  │
  │  └─ Initialize Page Object
  │     └─ Create page object instance
  │
  ├─ Navigate to Page
  │  │
  │  ├─ Execute page.goto()
  │  ├─ Wait for page load
  │  └─ Verify page displayed
  │
  ├─ Interact with Elements
  │  │
  │  ├─ Call page object methods
  │  ├─ Execute Playwright actions
  │  ├─ Handle any errors
  │  └─ Wait for state changes
  │
  ├─ Verify Results
  │  │
  │  ├─ Get element text/state
  │  ├─ Compare with expectations
  │  ├─ Call expect() assertions
  │  └─ Take screenshots on failure
  │
  └─ END
     │
     ├─ PASS: Move to next test
     └─ FAIL: Report error, screenshot
```

## Component Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Pages                            │
│                                                                  │
│   ┌──────────────┐  ┌─────────────┐  ┌───────────┐              │
│   │   Login      │  │  Register   │  │   Home    │              │
│   │   Page       │  │   Page      │  │   Page    │              │
│   └──────────────┘  └─────────────┘  └───────────┘              │
│                                           │                     │
│                                           ├─→ Jobs Page         │
│                                           ├─→ Profile Page      │
│                                           └─→ Application Page  │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────────┐
│                   Page Object Models                             │
│                                                                  │
│   ┌──────────────┐  ┌─────────────┐  ┌───────────┐              │
│   │ LoginPage    │  │RegisterPage │  │HomePage   │              │
│   │ .ts          │  │ .ts         │  │ .ts       │              │
│   └──────────────┘  └─────────────┘  └───────────┘              │
│                                           │                     │
│                                           └─→ JobsPage.ts       │
│                                                                  │
│        All extend BasePage.ts                                   │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Test Files                                  │
│                                                                  │
│   ┌──────────────┐                ┌──────────────┐              │
│   │  pom.spec.ts │                │workflows.spec.ts            │
│   │  4 Tests     │                │Refactored    │              │
│   └──────────────┘                └──────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Benefit: Code Reuse

```
BEFORE (Without POM):
┌────────────────────┐
│  Test File 1       │ → Selector: 'input[name="email"]'
├────────────────────┤
│  Test File 2       │ → Selector: 'input[name="email"]'
├────────────────────┤
│  Test File 3       │ → Selector: 'input[name="email"]'
└────────────────────┘

If selector changes:
→ Update 3 test files ❌

AFTER (With POM):
┌────────────────────┐
│  LoginPage.ts      │ → Selector: 'input[name="email"]'
├────────────────────┤
│  Test File 1       │ → Use: loginPage.enterEmail()
├────────────────────┤
│  Test File 2       │ → Use: loginPage.enterEmail()
├────────────────────┤
│  Test File 3       │ → Use: loginPage.enterEmail()
└────────────────────┘

If selector changes:
→ Update 1 page object file ✓
```

## Test Pyramid

```
            ┌─────────────────────────┐
            │   E2E/Acceptance Tests  │
            │   (Using POM Pattern)   │
            │   • pom.spec.ts (4)     │
            │   • workflows.spec.ts   │
            └─────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │   Integration Tests           │
        │   • integration.spec.ts       │
        │   • interactions.spec.ts      │
        └───────────────┬───────────────┘
                        │
        ┌───────────────┴───────────────┐
        │   Unit Tests / API Tests      │
        │   • utils.test.ts             │
        │   • api.test.ts               │
        └───────────────────────────────┘
```

---

**This architecture enables:**
✅ Easy test maintenance
✅ Code reusability
✅ Clear test structure
✅ Reduced duplication
✅ Better scalability
