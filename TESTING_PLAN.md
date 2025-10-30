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
