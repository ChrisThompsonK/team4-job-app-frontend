# Frontend Testing Plan

## Overview
This testing plan covers unit and integration tests for the Team 4 Job Application Frontend. The plan includes 10 test cases covering UI controllers, form validation, API service layer, and user interactions.

## Testing Framework
- **Framework**: Vitest
- **Coverage Tool**: @vitest/coverage-v8
- **Accessibility Testing**: Pa11y
- **HTTP Mocking**: Axios mocking for API calls

## Test Cases

### 1. User Registration Form Validation
**Description**: Test client-side validation for registration form  
**Type**: Unit Test  
**Component**: Form Controller / Registration View  
**Expected Behavior**:
- Validate email format
- Validate password strength (min 8 chars, special char, number)
- Validate first name and last name are not empty
- Show appropriate error messages
- Prevent form submission with invalid data

**Test Data**:
```javascript
// Valid
{ email: "test@example.com", password: "Pass123!", firstName: "John", lastName: "Doe" }

// Invalid
{ email: "invalid-email", password: "weak", firstName: "", lastName: "" }
```

---

### 2. User Login Form Validation
**Description**: Test login form validation and error handling  
**Type**: Unit Test  
**Component**: Auth Controller / Login View  
**Expected Behavior**:
- Validate email format
- Validate password is not empty
- Display error message on failed login
- Redirect to jobs page on successful login
- Store session/token appropriately

**Test Data**:
```javascript
// Valid
{ email: "user@example.com", password: "SecurePass123!" }

// Invalid credentials
{ email: "wrong@example.com", password: "WrongPassword" }
```

---

### 3. Job Listing Display
**Description**: Test fetching and displaying job listings  
**Type**: Integration Test  
**Component**: Job Controller / Jobs View  
**Expected Behavior**:
- Fetch jobs from API on page load
- Display all job fields correctly (name, location, band, etc.)
- Show "No jobs available" when empty
- Handle API errors gracefully
- Filter by status (open/closed) if applicable

**Mock API Response**:
```javascript
[
  {
    id: 1,
    name: "Software Engineer",
    location: "London",
    capability: "Engineering",
    band: "Mid Level",
    closingDate: "2025-12-31",
    status: "open",
    numberOfOpenPositions: 3
  }
]
```

---

### 4. Job Detail View
**Description**: Test displaying individual job details  
**Type**: Integration Test  
**Component**: Job Controller / Job Detail View  
**Expected Behavior**:
- Fetch job details by ID from API
- Display all job information (summary, responsibilities, etc.)
- Show "Apply" button for authenticated users
- Show "Not Found" for invalid job IDs
- Handle loading states

**Test URL**: `/jobs/1`

---

### 5. Create Job Form (Admin Only)
**Description**: Test job creation form validation and submission  
**Type**: Integration Test  
**Component**: Form Controller / Create Job View  
**Expected Behavior**:
- Require admin authentication
- Validate all required fields
- Validate date is in future
- Validate numberOfOpenPositions > 0
- Submit to API and redirect on success
- Display error messages on validation failure

**Test Data**:
```javascript
{
  name: "Senior Developer",
  location: "Remote",
  capability: "Software Development",
  band: "Senior",
  closingDate: "2025-12-31",
  summary: "Looking for senior dev",
  keyResponsibilities: "Lead development team",
  numberOfOpenPositions: 2
}
```

---

### 6. Application Submission Form
**Description**: Test job application form with file upload  
**Type**: Integration Test  
**Component**: Application Controller / Apply View  
**Expected Behavior**:
- Require user authentication
- Validate CV file upload (PDF, DOC, DOCX only)
- Validate file size (max 5MB)
- Display file name after selection
- Submit multipart form data to API
- Show success message and redirect

**Test Data**:
```javascript
{
  jobRoleId: 1,
  cvFile: new File(["content"], "resume.pdf", { type: "application/pdf" })
}
```

---

### 7. My Applications View
**Description**: Test displaying user's applications  
**Type**: Integration Test  
**Component**: Application Controller / My Applications View  
**Expected Behavior**:
- Require user authentication
- Fetch applications from API
- Display application list with job details
- Show application status (in progress, hired, rejected)
- Show "No applications" when empty
- Link to application details

**Mock API Response**:
```javascript
[
  {
    id: 1,
    jobRoleId: 1,
    status: "in progress",
    createdAt: "2025-10-30T10:00:00Z",
    jobRole: {
      name: "Software Engineer",
      location: "London"
    }
  }
]
```

---

### 8. Session Management
**Description**: Test user session handling and authentication state  
**Type**: Unit Test  
**Component**: Auth Middleware / Session Service  
**Expected Behavior**:
- Store session on successful login
- Clear session on logout
- Redirect to login for protected routes when not authenticated
- Pass user data to views when authenticated
- Handle session expiration

**Test Scenarios**:
- User logs in → session created
- User logs out → session destroyed
- Access protected route → redirects if not authenticated

---

### 9. API Service Layer - Error Handling
**Description**: Test API service error handling and retry logic  
**Type**: Unit Test  
**Component**: API Service Layer  
**Expected Behavior**:
- Handle network errors gracefully
- Display user-friendly error messages
- Handle 401 (redirect to login)
- Handle 403 (show forbidden message)
- Handle 404 (show not found)
- Handle 500 (show server error message)

**Test Cases**:
```javascript
// Network error
api.getJobs() // throws network error → displays "Connection failed"

// 401 Unauthorized
api.createJob() // returns 401 → redirects to /login

// 404 Not Found
api.getJob(999) // returns 404 → displays "Job not found"
```

---

### 10. Form Input Sanitization
**Description**: Test that user inputs are properly sanitized  
**Type**: Unit Test  
**Component**: Form Controller / Utils  
**Expected Behavior**:
- Escape HTML special characters
- Prevent XSS attacks
- Trim whitespace from inputs
- Sanitize before sending to API
- Preserve valid special characters in appropriate fields

**Test Data**:
```javascript
// Input
{ name: "<script>alert('xss')</script>", location: "  London  " }

// Expected sanitized
{ name: "&lt;script&gt;alert('xss')&lt;/script&gt;", location: "London" }
```

---

## Implementation Steps

### Step 1: Setup Test Environment
```bash
# Testing dependencies are already installed
# Verify installation:
npm list vitest @vitest/coverage-v8
```

### Step 2: Create Test Directory Structure
```
src/
  tests/
    unit/
      form-validation.test.ts
      auth.test.ts
      utils.test.ts
    integration/
      job-controller.test.ts
      application-controller.test.ts
      auth-controller.test.ts
    mocks/
      api-responses.ts
      mock-files.ts
    utils/
      test-helpers.ts
```

### Step 3: Create Test Utilities
```typescript
// src/tests/utils/test-helpers.ts
import { vi } from "vitest";

export function mockRequest(data: any = {}) {
  return {
    body: data.body || {},
    params: data.params || {},
    query: data.query || {},
    session: data.session || {},
    file: data.file || null
  };
}

export function mockResponse() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.render = vi.fn().mockReturnValue(res);
  res.redirect = vi.fn().mockReturnValue(res);
  return res;
}

export function createMockFile(
  name: string,
  type: string = "application/pdf",
  size: number = 1024
) {
  return {
    originalname: name,
    mimetype: type,
    size: size,
    path: `/uploads/cvs/${name}`,
    filename: name
  };
}
```

### Step 4: Create Mock API Responses
```typescript
// src/tests/mocks/api-responses.ts
export const mockJobs = [
  {
    id: 1,
    name: "Software Engineer",
    location: "London",
    capability: "Engineering",
    band: "Mid Level",
    closingDate: "2025-12-31",
    summary: "Job summary",
    keyResponsibilities: "Responsibilities",
    status: "open",
    numberOfOpenPositions: 3
  }
];

export const mockApplications = [
  {
    id: 1,
    userId: 1,
    jobRoleId: 1,
    status: "in progress",
    createdAt: "2025-10-30T10:00:00Z",
    jobRole: mockJobs[0]
  }
];

export const mockUser = {
  id: 1,
  email: "test@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "user"
};

export const mockAdmin = {
  id: 2,
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  role: "admin"
};
```

### Step 5: Implement Form Validation Tests
```typescript
// src/tests/unit/form-validation.test.ts
import { describe, it, expect } from "vitest";
import { 
  validateEmail, 
  validatePassword, 
  validateJobForm 
} from "../../utils/validators";

describe("Form Validation", () => {
  describe("Registration Form", () => {
    it("should validate correct email format", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("invalid-email")).toBe(false);
    });

    it("should validate password strength", () => {
      expect(validatePassword("Pass123!")).toBe(true);
      expect(validatePassword("weak")).toBe(false);
    });
  });

  describe("Job Creation Form", () => {
    it("should validate all required fields", () => {
      const validJob = {
        name: "Software Engineer",
        location: "London",
        // ... all fields
      };
      expect(validateJobForm(validJob)).toBe(true);
    });

    it("should reject future closing date validation", () => {
      const invalidJob = {
        closingDate: "2020-01-01" // Past date
      };
      expect(validateJobForm(invalidJob)).toBe(false);
    });
  });
});
```

### Step 6: Implement Controller Tests
```typescript
// src/tests/integration/job-controller.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { getJobs, getJobById, createJob } from "../../controllers/job-controller";
import { mockRequest, mockResponse } from "../utils/test-helpers";
import { mockJobs } from "../mocks/api-responses";

describe("Job Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and display all jobs", async () => {
    // Mock API call
    const req = mockRequest();
    const res = mockResponse();
    
    await getJobs(req, res);
    
    expect(res.render).toHaveBeenCalledWith("jobs", {
      jobs: expect.arrayContaining([
        expect.objectContaining({ name: "Software Engineer" })
      ])
    });
  });

  it("should display single job details", async () => {
    const req = mockRequest({ params: { id: "1" } });
    const res = mockResponse();
    
    await getJobById(req, res);
    
    expect(res.render).toHaveBeenCalledWith("job-detail", {
      job: expect.objectContaining({ id: 1 })
    });
  });

  it("should handle job not found", async () => {
    const req = mockRequest({ params: { id: "999" } });
    const res = mockResponse();
    
    await getJobById(req, res);
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.render).toHaveBeenCalledWith("error", {
      message: "Job not found"
    });
  });
});
```

### Step 7: Implement Application Tests
```typescript
// src/tests/integration/application-controller.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { submitApplication, getMyApplications } from "../../controllers/application-controller";
import { mockRequest, mockResponse, createMockFile } from "../utils/test-helpers";

describe("Application Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should submit application with CV upload", async () => {
    const mockFile = createMockFile("resume.pdf");
    const req = mockRequest({
      body: { jobRoleId: 1 },
      file: mockFile,
      session: { userId: 1 }
    });
    const res = mockResponse();
    
    await submitApplication(req, res);
    
    expect(res.redirect).toHaveBeenCalledWith("/applications/my-applications");
  });

  it("should reject invalid file types", async () => {
    const mockFile = createMockFile("resume.exe", "application/exe");
    const req = mockRequest({
      body: { jobRoleId: 1 },
      file: mockFile,
      session: { userId: 1 }
    });
    const res = mockResponse();
    
    await submitApplication(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should display user's applications", async () => {
    const req = mockRequest({ session: { userId: 1 } });
    const res = mockResponse();
    
    await getMyApplications(req, res);
    
    expect(res.render).toHaveBeenCalledWith("my-applications", {
      applications: expect.any(Array)
    });
  });
});
```

### Step 8: Implement Authentication Tests
```typescript
// src/tests/integration/auth-controller.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { login, logout, register } from "../../controllers/auth-controller";
import { mockRequest, mockResponse } from "../utils/test-helpers";

describe("Auth Controller", () => {
  it("should login with valid credentials", async () => {
    const req = mockRequest({
      body: {
        email: "test@example.com",
        password: "Pass123!"
      }
    });
    const res = mockResponse();
    
    await login(req, res);
    
    expect(req.session.userId).toBeDefined();
    expect(res.redirect).toHaveBeenCalledWith("/jobs");
  });

  it("should reject invalid credentials", async () => {
    const req = mockRequest({
      body: {
        email: "wrong@example.com",
        password: "WrongPass"
      }
    });
    const res = mockResponse();
    
    await login(req, res);
    
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should clear session on logout", async () => {
    const req = mockRequest({ session: { userId: 1 } });
    const res = mockResponse();
    
    await logout(req, res);
    
    expect(req.session.userId).toBeUndefined();
    expect(res.redirect).toHaveBeenCalledWith("/login");
  });
});
```

### Step 9: Implement Utility Tests
```typescript
// src/tests/unit/utils.test.ts
import { describe, it, expect } from "vitest";
import { sanitizeInput, formatDate, validateFileType } from "../../utils";

describe("Utility Functions", () => {
  it("should sanitize HTML input", () => {
    const input = "<script>alert('xss')</script>";
    const sanitized = sanitizeInput(input);
    expect(sanitized).not.toContain("<script>");
  });

  it("should validate allowed file types", () => {
    expect(validateFileType("application/pdf")).toBe(true);
    expect(validateFileType("application/msword")).toBe(true);
    expect(validateFileType("application/exe")).toBe(false);
  });

  it("should format dates correctly", () => {
    const date = new Date("2025-10-30");
    expect(formatDate(date)).toBe("30/10/2025");
  });
});
```

### Step 10: Configure Test Scripts
Update `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:unit": "vitest run src/tests/unit",
    "test:integration": "vitest run src/tests/integration",
    "test:watch": "vitest watch",
    "test:a11y": "tsx accessibility-tests.ts"
  }
}
```

### Step 11: Run Tests
```bash
# Run all tests
npm test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run accessibility tests
npm run test:a11y

# Watch mode for development
npm run test:watch
```

### Step 12: Accessibility Testing
The project already has accessibility testing setup. Ensure tests cover:
- Login page accessibility
- Job listing page accessibility
- Job application form accessibility
- Navigation accessibility
- Form error message accessibility

Run with:
```bash
npm run test:a11y
```

## Success Criteria
- All 10 test cases pass
- Test coverage > 70% for controllers and utilities
- Tests run in CI/CD pipeline
- No accessibility violations in Pa11y tests
- Tests run independently and can be run in any order

## Coverage Goals
- **Controllers**: > 80% coverage
- **Utilities**: > 90% coverage
- **Form Validation**: > 85% coverage
- **Overall**: > 70% coverage

## Continuous Integration
Tests should run on:
- Every pull request
- Before merge to main
- Pre-deployment checks

## Maintenance
- Update tests when UI changes
- Add new tests for new features
- Review accessibility compliance quarterly
- Keep mock data synchronized with API changes
- Update test utilities as needed
