# Test Case Template

This template provides a standardized format for documenting test cases for the Job Application System frontend. Use this template to ensure comprehensive test coverage across unit tests, integration tests, end-to-end tests, and accessibility tests.

---

## Test Case Information

**Test Case ID:** TC-XXX  
**Feature/Module:** [e.g., Admin Report Generation, Job Application Submission]  
**Test Type:** [ ] Unit Test [ ] Integration Test [ ] E2E Test [ ] Accessibility Test  
**Priority:** [ ] Critical [ ] High [ ] Medium [ ] Low  
**Author:** [Your Name]  
**Created Date:** YYYY-MM-DD  
**Last Updated:** YYYY-MM-DD  
**Status:** [ ] Draft [ ] Ready for Review [ ] Approved [ ] Deprecated

---

## Test Case Details

### Test Case Name
[Clear, descriptive name that explains what is being tested]

### Objective
[Brief description of what this test case aims to verify]

### Preconditions
[List any setup requirements, test data, or system states needed before test execution]

- Precondition 1
- Precondition 2
- Precondition 3

### Test Data
[Specify any test data required]

| Field | Value | Notes |
|-------|-------|-------|
| Example Field | Example Value | Example Notes |

---

## Test Steps

### For Manual Tests

| Step # | Action | Expected Result | Actual Result | Status |
|--------|--------|-----------------|---------------|--------|
| 1 | [Action to perform] | [What should happen] | [What actually happened] | [ ] Pass [ ] Fail |
| 2 | [Action to perform] | [What should happen] | [What actually happened] | [ ] Pass [ ] Fail |
| 3 | [Action to perform] | [What should happen] | [What actually happened] | [ ] Pass [ ] Fail |

### For Automated Tests

**File Location:** `tests/[filename].spec.ts` or `src/[filename].test.ts`

**Test Code Structure:**
```typescript
describe('[Feature/Component Name]', () => {
  // Setup
  beforeEach(() => {
    // Arrange: Set up test conditions
  });

  test('[Test Case Name]', async () => {
    // Arrange: Prepare test data and conditions
    
    // Act: Perform the action being tested
    
    // Assert: Verify the expected outcome
    expect(actualResult).toBe(expectedResult);
  });

  afterEach(() => {
    // Cleanup
  });
});
```

---

## Expected Results

### Success Criteria
[Detailed description of what constitutes a passing test]

- Expected behavior 1
- Expected behavior 2
- Expected behavior 3

### Error Scenarios (if applicable)
[What should happen when errors occur]

- Error scenario 1 and expected handling
- Error scenario 2 and expected handling

---

## Postconditions

[State of the system after test execution]

- Postcondition 1
- Postcondition 2

---

## Test Environment

**Browser(s):** [ ] Chrome [ ] Firefox [ ] Safari [ ] Edge  
**Device(s):** [ ] Desktop [ ] Tablet [ ] Mobile  
**Screen Sizes:** [e.g., 1920x1080, 1366x768, 375x667]  
**Node Version:** [e.g., 20.x]  
**Test Framework:** [ ] Vitest [ ] Playwright [ ] Pa11y  

---

## Dependencies

**Related Features:**
- Feature/Component 1
- Feature/Component 2

**Dependent Test Cases:**
- TC-XXX must pass before this test
- This test is a prerequisite for TC-YYY

**External Dependencies:**
- Backend API endpoint: [URL/endpoint name]
- Database state: [required state]
- Third-party service: [service name]

---

## Test Automation Details

### Automation Feasibility
[ ] Fully Automatable  
[ ] Partially Automatable  
[ ] Manual Only  

**Reason if not fully automatable:**
[Explain why automation is limited]

### Automation Status
[ ] Not Started  
[ ] In Progress  
[ ] Automated  
[ ] Maintenance Required  

### Test File Location
```
[Relative path to test file]
```

### Test Execution Command
```bash
npm run test:unit -- [test-file-name]
# or
npm run test:e2e -- [test-file-name]
# or
npm run test:a11y
```

---

## Accessibility Considerations

### WCAG Compliance Level
[ ] A [ ] AA [ ] AAA

### Accessibility Checks
- [ ] Keyboard navigation works correctly
- [ ] Screen reader announces content properly
- [ ] Color contrast meets requirements (4.5:1 for text)
- [ ] Focus indicators are visible
- [ ] ARIA labels are present and correct
- [ ] Form validation errors are announced
- [ ] Images have alt text
- [ ] Headings are hierarchical

### Assistive Technology Testing
- [ ] NVDA (Windows)
- [ ] JAWS (Windows)
- [ ] VoiceOver (macOS/iOS)
- [ ] TalkBack (Android)

---

## Performance Considerations

**Expected Performance Metrics:**
- Page load time: [e.g., < 2 seconds]
- Time to interactive: [e.g., < 3 seconds]
- API response time: [e.g., < 500ms]
- Rendering time: [e.g., < 100ms]

**Performance Testing:**
- [ ] Load time within acceptable range
- [ ] No memory leaks
- [ ] Smooth animations (60fps)
- [ ] Network requests optimized

---

## Test Results

### Execution History

| Date | Tester | Environment | Result | Notes |
|------|--------|-------------|--------|-------|
| YYYY-MM-DD | [Name] | [Browser/Device] | [ ] Pass [ ] Fail | [Comments] |

### Defects Found

| Defect ID | Description | Severity | Status |
|-----------|-------------|----------|--------|
| BUG-XXX | [Description] | [ ] Critical [ ] High [ ] Medium [ ] Low | [ ] Open [ ] Fixed |

### Screenshots/Evidence

[Attach screenshots, videos, or logs that demonstrate test execution]

---

## Code Coverage

**Target Coverage:** [e.g., >80%]  
**Actual Coverage:** [e.g., 85%]  

**Coverage Report Location:**
```
coverage/index.html
```

---

## Maintenance Notes

### Last Review Date
YYYY-MM-DD

### Review Frequency
[ ] Every Sprint  
[ ] Monthly  
[ ] Quarterly  
[ ] As Needed  

### Known Issues/Limitations
[Document any known issues or limitations with this test case]

- Issue 1
- Issue 2

### Future Improvements
[Suggestions for enhancing this test case]

- Improvement 1
- Improvement 2

---

## Additional Notes

[Any other relevant information about this test case]

---

## Approval

**Reviewed By:** [Name]  
**Review Date:** YYYY-MM-DD  
**Approval Status:** [ ] Approved [ ] Needs Revision [ ] Rejected  
**Comments:**

---

## Related Documentation

- [Link to feature specification]
- [Link to user story/JIRA ticket]
- [Link to design mockups]
- [Link to API documentation]

---

## Example Test Cases

### Example 1: Unit Test Template

**Test Case ID:** TC-001  
**Feature/Module:** Job Application Form Validation  
**Test Type:** ✓ Unit Test  

```typescript
// src/validators/job-application.test.ts
import { describe, test, expect } from 'vitest';
import { validateJobApplication } from './job-application';

describe('Job Application Validation', () => {
  test('should validate valid job application data', () => {
    const validData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      resume: 'resume.pdf'
    };
    
    const result = validateJobApplication(validData);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject invalid email format', () => {
    const invalidData = {
      fullName: 'John Doe',
      email: 'invalid-email',
      phone: '555-1234',
      resume: 'resume.pdf'
    };
    
    const result = validateJobApplication(invalidData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid email format');
  });
});
```

### Example 2: E2E Test Template

**Test Case ID:** TC-050  
**Feature/Module:** User Login Flow  
**Test Type:** ✓ E2E Test  

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('should allow user to login with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in credentials
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Verify user is logged in
    await expect(page.locator('.user-profile')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.locator('.error-message')).toContainText('Invalid credentials');
    
    // Verify still on login page
    await expect(page).toHaveURL('/login');
  });
});
```

### Example 3: Accessibility Test Template

**Test Case ID:** TC-100  
**Feature/Module:** Job Listing Page Accessibility  
**Test Type:** ✓ Accessibility Test  

```typescript
// accessibility-tests.ts
import pa11y from 'pa11y';

test('Job listing page meets WCAG 2.1 AA standards', async () => {
  const results = await pa11y('http://localhost:3000/jobs', {
    standard: 'WCAG2AA',
    runners: ['axe', 'htmlcs']
  });
  
  expect(results.issues.filter(issue => issue.type === 'error')).toHaveLength(0);
});
```

---

## Quick Reference Checklist

**Before Writing Test:**
- [ ] Understand the feature/requirement completely
- [ ] Identify test boundaries and edge cases
- [ ] Determine appropriate test type(s)
- [ ] Review existing related tests
- [ ] Prepare test data

**While Writing Test:**
- [ ] Follow naming conventions
- [ ] Write clear, descriptive test names
- [ ] Include arrange-act-assert pattern
- [ ] Add meaningful assertions
- [ ] Handle async operations properly
- [ ] Consider error scenarios

**After Writing Test:**
- [ ] Run test locally and verify it passes
- [ ] Check code coverage impact
- [ ] Run linter (Biome)
- [ ] Review test with team
- [ ] Update documentation
- [ ] Add to CI/CD pipeline if applicable

---

## Support

For questions about testing or this template:
- Review `README.md` in the tests folder
- Check `TESTING_PLAN.md` for overall test strategy
- Consult team's testing guidelines
- Ask in team chat/stand-up

---

**Template Version:** 1.0  
**Last Updated:** 2025-11-05
