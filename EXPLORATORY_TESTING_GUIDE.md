# Exploratory Testing Guide - Kainos Job Portal Frontend

## 📋 Overview

This document provides an exploratory testing guide for first-time testers of the Kainos Job Portal frontend application. The guide focuses on simple user flows and common use cases to help identify potential issues, usability problems, and edge cases.

**Application URL:** `http://localhost:3000`  
**Backend Requirement:** Backend API must be running on `http://localhost:8080` or configured API_BASE_URL

---

## 🎯 Testing Objectives

- Validate core user journeys (browsing, applying, managing applications)
- Identify usability issues and UI/UX problems
- Test form validation and error handling
- Verify authentication and authorization flows
- Check responsive design and accessibility
- Explore edge cases and boundary conditions

---

## 👥 User Personas

### 1. **Job Seeker (Regular User)**
- Can browse job listings
- Can register and login
- Can apply for jobs
- Can view their own applications
- Cannot create or manage jobs

### 2. **Admin User**
- Can create, edit, and delete job roles
- Can view and manage applications
- Can accept/reject applications
- Cannot apply for jobs themselves

---

## 🧪 Test Scenarios

### 1. Homepage Exploration

**Goal:** Verify the homepage displays correctly and provides clear navigation.

#### Test Steps:
1. Navigate to `http://localhost:3000`
2. Observe the page layout and content

#### What to Check:
- [ ] Kainos logo is visible and properly sized
- [ ] Homepage displays a welcome message or hero section
- [ ] Latest 3 job postings are displayed (if available)
- [ ] Each job card shows: job title, location, capability, band, closing date
- [ ] Navigation menu is visible with links to Jobs, Login/Register
- [ ] "View All Jobs" or similar CTA button is present
- [ ] Footer contains relevant information

#### Exploratory Questions:
- What happens if there are no jobs in the system?
- Are the job cards clickable? Do they navigate to the correct job details?
- Is the closing date formatted correctly (e.g., DD/MM/YYYY)?
- Does the layout break on mobile devices?
- Are images loading properly?

---

### 2. User Registration Flow

**Goal:** Test the account creation process for new users.

#### Test Steps:
1. Click on "Register" or "Sign Up" link
2. Fill out the registration form
3. Submit the form

#### What to Check:
- [ ] Registration form has fields: First Name, Last Name, Email, Password, Confirm Password
- [ ] All required fields are marked with asterisks (*)
- [ ] Password requirements are clearly displayed
- [ ] Form validation works for:
  - Empty fields
  - Invalid email format
  - Password mismatch
  - Weak passwords
- [ ] Success message appears after successful registration
- [ ] User is redirected appropriately (e.g., to login page or homepage)

#### Exploratory Questions:
- Can I register with an already existing email?
- What is the minimum/maximum password length?
- Does the password field hide characters?
- Can I paste into the password field?
- What special characters are allowed in names?
- Does email validation accept `user+tag@example.com` format?
- What happens if I click "Back" during registration?
- Are there CAPTCHA or bot protection mechanisms?

#### Test Data:
```
Valid Registration:
- First Name: John
- Last Name: Doe
- Email: john.doe@example.com
- Password: Test123!@#
- Confirm Password: Test123!@#

Invalid Cases:
- Email: notanemail
- Password: 123 (too weak)
- Confirm Password: differentpassword
```

---

### 3. User Login Flow

**Goal:** Test authentication mechanism for existing users.

#### Test Steps:
1. Click on "Login" link
2. Enter credentials
3. Submit the form

#### What to Check:
- [ ] Login form has Email and Password fields
- [ ] Password field masks input
- [ ] "Remember me" option (if available)
- [ ] Error message for incorrect credentials
- [ ] Success redirect to intended page or homepage
- [ ] User session persists across page navigation
- [ ] Logout functionality works correctly

#### Exploratory Questions:
- What happens with invalid email format?
- What is the error message for wrong password?
- Is there rate limiting for failed login attempts?
- Can I login with uppercase/lowercase email variations?
- What happens if backend is down during login?
- Is there a "Forgot Password" link?
- Does the session expire? After how long?

#### Test Data:
```
Valid Login (after registration):
- Email: john.doe@example.com
- Password: Test123!@#

Invalid Cases:
- Email: wrong@example.com
- Password: wrongpassword
- Email: JOHN.DOE@EXAMPLE.COM (case sensitivity test)
```

---

### 4. Browsing Job Listings

**Goal:** Explore the job listings page and filtering functionality.

#### Test Steps:
1. Navigate to "Jobs" or "View All Jobs"
2. Observe the job listings page
3. Try search and filter options

#### What to Check:
- [ ] All jobs are displayed in a list/grid format
- [ ] Each job card shows key information (title, location, capability, band, closing date)
- [ ] Search bar is present and functional
- [ ] Filter dropdowns for Location, Capability, Band work correctly
- [ ] Pagination controls appear when needed
- [ ] Job count/total is displayed
- [ ] "Create New Job Role" button visible for admin users only

#### Exploratory Questions:
- What happens if there are 0 jobs matching filters?
- Can I combine multiple filters (e.g., Location + Capability)?
- Does search work with partial keywords?
- Is search case-sensitive?
- How many jobs appear per page?
- What happens when I navigate to page 100 (non-existent)?
- Do filters persist when navigating between pages?
- Can I clear all filters at once?
- What happens if I type special characters in search?

#### Test Data:
```
Search Terms:
- "Engineer" (should match Software Engineer, etc.)
- "xyz123" (should return no results)
- "<!script>" (XSS test)

Filter Combinations:
- Location: Belfast + Capability: Engineering
- Band: Principal
- All filters empty (should show all jobs)
```

---

### 5. Viewing Job Details

**Goal:** Verify job detail page displays complete information.

#### Test Steps:
1. Click on a job card from the listings page
2. Observe the job detail page

#### What to Check:
- [ ] Job title is prominently displayed
- [ ] All metadata visible (location, capability, band, closing date, status, open positions)
- [ ] Job summary section is complete
- [ ] Key responsibilities section is complete
- [ ] "Apply Now" button is visible for eligible users
- [ ] Breadcrumb navigation works (Home > Jobs > Job Title)
- [ ] "Back to Jobs" link works
- [ ] Admin sees "Edit" and "Delete" buttons
- [ ] Non-admin users see "Apply Now" button

#### Exploratory Questions:
- What happens if I navigate to a non-existent job ID (`/jobs/99999`)?
- What happens if job ID is not a number (`/jobs/abc`)?
- Does the closing date show as expired for old jobs?
- Is the "Apply" button disabled for closed jobs?
- What happens if a job has 0 open positions?
- Can admins accidentally see "Apply" button?
- Are there any broken image links?
- Is the content properly formatted (line breaks, spacing)?

---

### 6. Applying for a Job (Job Seeker Flow)

**Goal:** Test the complete job application submission process.

#### Test Steps:
1. Login as a regular user (not admin)
2. Navigate to a job detail page
3. Click "Apply Now"
4. Fill out the application form
5. Upload CV
6. Submit application

#### What to Check:
- [ ] Application form displays with user's pre-filled information
- [ ] Fields include: Name (pre-filled), Email (pre-filled), Phone Number, CV Upload
- [ ] CV upload accepts PDF, DOC, DOCX formats
- [ ] File size limit is enforced (max 5MB)
- [ ] Required fields are marked
- [ ] Form validation works for all fields
- [ ] Success message appears after submission
- [ ] User is redirected to success page or application list
- [ ] Cannot apply for the same job twice
- [ ] Cannot apply if already applied

#### Exploratory Questions:
- Can I upload a 10MB file?
- What happens if I upload a .txt file instead of PDF/DOC?
- Can I upload a file with special characters in the name?
- What happens if I submit without uploading a CV?
- Can I apply without logging in?
- What if I try to apply for a closed job by directly accessing the URL?
- Can I apply if there are 0 open positions?
- What happens if the file upload fails?
- Is there a confirmation email sent?

#### Test Data:
```
Valid Application:
- Phone: +44 7123 456789
- CV: valid-resume.pdf (2MB)

Invalid Cases:
- CV: large-file.pdf (10MB)
- CV: script.exe
- Phone: abc123 (invalid format)
```

---

### 7. Viewing My Applications (Job Seeker)

**Goal:** Verify users can track their submitted applications.

#### Test Steps:
1. Login as a regular user who has applied for jobs
2. Navigate to "My Applications"
3. View application list and details

#### What to Check:
- [ ] All submitted applications are listed
- [ ] Each application shows: job title, application date, status
- [ ] Status badges display correctly (Pending, Reviewed, Accepted, Rejected)
- [ ] "View Application Details" button works
- [ ] "View Job" link navigates to original job posting
- [ ] Empty state message appears if no applications exist
- [ ] Application detail page shows full information including CV link

#### Exploratory Questions:
- What happens if I navigate to another user's application URL?
- Can I download my uploaded CV?
- Are applications sorted by date (newest first)?
- What happens if a job I applied for is deleted?
- Can I withdraw an application?
- Do I see different content for different statuses?
- Is there pagination for applications?

---

### 8. Creating a Job Role (Admin Flow)

**Goal:** Test job creation process for admin users.

#### Test Steps:
1. Login as an admin user
2. Navigate to "Create New Job Role"
3. Fill out the job creation form
4. Submit the form

#### What to Check:
- [ ] Form includes all fields: Job Title, Location, Capability, Band, Closing Date, Number of Open Positions, Status, Summary, Key Responsibilities
- [ ] All required fields are marked with asterisks
- [ ] Dropdown menus are populated with correct options
- [ ] Date picker works for Closing Date
- [ ] Number of positions accepts only positive integers
- [ ] Success message appears after job creation
- [ ] Newly created job appears in job listings
- [ ] Redirected to job detail page or job listings

#### Exploratory Questions:
- Can I create a job with a past closing date?
- What is the minimum/maximum length for job title?
- Can I use special characters in any fields?
- What happens if I leave required fields empty?
- Can I set negative number of positions?
- Can I set 0 positions?
- What happens if capability/band dropdowns are empty?
- Can I create duplicate jobs with same title?
- Is there a character limit for Summary and Key Responsibilities?
- What happens if I try to inject HTML/JavaScript in text fields?

#### Test Data:
```
Valid Job:
- Job Title: Senior Software Engineer
- Location: Belfast, UK
- Capability: Engineering
- Band: Senior
- Closing Date: 2025-12-31
- Number of Positions: 3
- Status: Open
- Summary: We are looking for...
- Key Responsibilities: Design and develop...

Invalid Cases:
- Job Title: <script>alert('XSS')</script>
- Number of Positions: -1
- Closing Date: 2020-01-01 (past date)
```

---

### 9. Editing a Job Role (Admin Flow)

**Goal:** Test job modification functionality.

#### Test Steps:
1. Login as admin
2. Navigate to a job detail page
3. Click "Edit" button
4. Modify job information
5. Save changes

#### What to Check:
- [ ] Edit form is pre-populated with existing data
- [ ] All fields are editable
- [ ] Validation works on update
- [ ] Success message appears after saving
- [ ] Changes are reflected on job detail page
- [ ] "Cancel" button returns to job detail without saving

#### Exploratory Questions:
- Can I change a job's status from Open to Closed?
- What happens to existing applications if I reduce number of positions?
- Can I set closing date to yesterday?
- What happens if I clear all fields and try to save?
- Can I change the job ID via URL manipulation?
- Is there an audit trail of changes?

---

### 10. Deleting a Job Role (Admin Flow)

**Goal:** Test job deletion and its impact on applications.

#### Test Steps:
1. Login as admin
2. Navigate to a job with applications
3. Click "Delete" button
4. Confirm deletion

#### What to Check:
- [ ] Confirmation dialog appears before deletion
- [ ] Warning message mentions deletion of applications
- [ ] Job is removed from listings after deletion
- [ ] Attempting to access deleted job shows 404 or error message
- [ ] Associated applications are deleted (or handled appropriately)

#### Exploratory Questions:
- Can I cancel the deletion?
- What happens to applicants' application history?
- Is there a "soft delete" or is it permanent?
- Can I delete a job that has been accepted by someone?
- What happens if I try to delete a non-existent job ID?

---

### 11. Managing Applications (Admin Flow)

**Goal:** Test application review and management features.

#### Test Steps:
1. Login as admin
2. Navigate to a job detail page with applications
3. Click "View Applications"
4. Review applications
5. Accept/Reject applications

#### What to Check:
- [ ] All applications for the job are listed
- [ ] Application details include: applicant name, email, phone, CV link, application date, status
- [ ] CV download link works
- [ ] "Accept" button changes application status
- [ ] "Reject" button changes application status
- [ ] Success/confirmation messages appear
- [ ] Status updates are reflected immediately
- [ ] Cannot accept more applications than open positions

#### Exploratory Questions:
- Can I view another admin's notes on applications?
- Can I accept multiple applications for a single position?
- What happens if I accept an application for a job with 0 positions?
- Can I download all CVs at once?
- Is there a way to bulk accept/reject?
- What happens if CV file is missing or corrupted?
- Can I reverse an accept/reject decision?

---

### 12. Responsive Design Testing

**Goal:** Verify the application works on different screen sizes.

#### Test Steps:
1. Open the application on desktop
2. Resize browser window to mobile size
3. Test all major flows on mobile viewport

#### What to Check:
- [ ] Mobile menu/hamburger navigation works
- [ ] Forms are usable on mobile (no horizontal scrolling)
- [ ] Buttons are large enough to tap on mobile
- [ ] Job cards stack properly on mobile
- [ ] Tables/data are responsive (scroll or reformat)
- [ ] Images scale properly
- [ ] Text is readable (not too small)
- [ ] Modals/dialogs work on mobile

#### Devices to Test:
- Desktop: 1920x1080, 1366x768
- Tablet: 768x1024 (iPad)
- Mobile: 375x667 (iPhone), 414x896 (iPhone Plus)

---

### 13. Error Handling and Edge Cases

**Goal:** Test how the application handles errors and unexpected situations.

#### Test Scenarios:

##### A. Backend Unavailable
- [ ] Stop the backend server
- [ ] Try to browse jobs
- [ ] Observe error message
- [ ] Check if application shows user-friendly error

##### B. Network Issues
- [ ] Throttle network speed (Chrome DevTools)
- [ ] Submit a large CV file
- [ ] Observe loading states and error handling

##### C. Session Expiration
- [ ] Login and wait for session to expire (or manually delete session cookie)
- [ ] Try to perform an action
- [ ] Verify redirect to login page with appropriate message

##### D. Permission Violations
- [ ] As regular user, try to access admin URLs directly:
  - `/jobs/create`
  - `/jobs/1/edit`
  - `/jobs/1/applications`
- [ ] Verify proper error messages or redirects

##### E. Invalid Data
- [ ] Try SQL injection in search: `' OR '1'='1`
- [ ] Try XSS in job title: `<script>alert('XSS')</script>`
- [ ] Try very long strings in text fields (10,000+ characters)
- [ ] Try negative numbers where positive expected

---

### 14. Accessibility Testing

**Goal:** Ensure the application is accessible to all users.

#### What to Check:
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG standards
- [ ] Screen reader compatibility (use NVDA or JAWS)
- [ ] Semantic HTML is used (headings, lists, buttons)
- [ ] ARIA labels where needed

#### Tools to Use:
- Chrome Lighthouse Accessibility Audit
- WAVE Browser Extension
- axe DevTools
- Keyboard-only navigation test

---

### 15. Cross-Browser Testing

**Goal:** Verify consistent behavior across different browsers.

#### Browsers to Test:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### What to Check:
- Layout consistency
- Form submission behavior
- File upload functionality
- Date picker compatibility
- CSS animations
- JavaScript functionality

---

## 🐛 Common Issues to Look For

### UI/UX Issues:
- Broken layouts on specific screen sizes
- Misaligned elements
- Overlapping text
- Inconsistent button styles
- Poor color contrast
- Missing loading indicators
- No error messages or unclear errors

### Functional Issues:
- Form validation not working
- Buttons not responding to clicks
- Links leading to 404 pages
- Images not loading
- File upload failures
- Session not persisting
- Incorrect redirects

### Security Issues:
- XSS vulnerabilities in text inputs
- SQL injection in search/filters
- Missing authentication checks
- Exposed admin functionalities
- Insecure file uploads
- Session fixation

### Performance Issues:
- Slow page loads
- Large image files
- Unoptimized database queries
- Memory leaks
- Excessive API calls

---

## 📝 Bug Report Template

When you find an issue, document it using this template:

```markdown
**Bug ID:** BUG-001
**Title:** Brief description of the issue
**Severity:** Critical / High / Medium / Low
**Priority:** P0 / P1 / P2 / P3

**Environment:**
- Browser: Chrome 120.0
- Device: Desktop
- OS: macOS Sonoma
- User Role: Job Seeker / Admin

**Steps to Reproduce:**
1. Navigate to...
2. Click on...
3. Enter...
4. Observe...

**Expected Result:**
What should happen

**Actual Result:**
What actually happens

**Screenshots/Videos:**
[Attach if applicable]

**Additional Notes:**
Any other relevant information
```

---

## 🎓 Tips for Exploratory Testing

1. **Think Like a User:** Put yourself in the shoes of both job seekers and admins
2. **Be Creative:** Try unconventional actions and input combinations
3. **Test Boundaries:** Use minimum/maximum values, empty inputs, special characters
4. **Follow Your Curiosity:** If something seems odd, investigate further
5. **Document Everything:** Take screenshots, note steps, record observations
6. **Test One Thing at a Time:** Isolate variables to identify root causes
7. **Use Developer Tools:** Inspect network requests, console errors, HTML structure
8. **Test Negative Scenarios:** Not just happy paths, but what happens when things go wrong
9. **Vary Your Approach:** Don't always follow the same sequence
10. **Take Breaks:** Fresh eyes catch more issues

---

## 📊 Test Coverage Checklist

### Core Functionality
- [ ] User registration and login
- [ ] Job browsing and search
- [ ] Job filtering and pagination
- [ ] Job application submission
- [ ] Application tracking
- [ ] Job creation (admin)
- [ ] Job editing (admin)
- [ ] Job deletion (admin)
- [ ] Application management (admin)

### Non-Functional
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Cross-browser compatibility
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Performance (page load times)
- [ ] Security (XSS, CSRF, authentication)
- [ ] Error handling
- [ ] Data validation

### User Experience
- [ ] Navigation clarity
- [ ] Form usability
- [ ] Error messages
- [ ] Success confirmations
- [ ] Loading states
- [ ] Empty states

---

## 🚀 Getting Started

1. **Set up the environment:**
   ```bash
   # Start backend
   cd team4-job-app-backend
   npm run dev
   
   # Start frontend
   cd team4-job-app-frontend
   npm run dev
   ```

2. **Create test accounts:**
   - Regular user: Register via `/register`
   - Admin user: Check with development team for admin credentials

3. **Seed test data:**
   - Backend should have seed data with jobs
   - Create at least 5-10 test jobs with varied data

4. **Start testing:**
   - Begin with simple flows (homepage, browsing)
   - Progress to complex flows (applications, admin functions)
   - Document findings as you go

---

## 📚 Additional Resources

- **Application Documentation:** [README.md](./README.md)
- **Testing Plan:** [TESTING_PLAN.md](./TESTING_PLAN.md)
- **Accessibility Tests:** Run with `npm run test:a11y`
- **Chrome DevTools:** For network, console, and responsive testing
- **WAVE Extension:** For accessibility scanning

---

**Happy Testing! 🧪**

Remember: The goal of exploratory testing is not just to find bugs, but to understand the application deeply and provide valuable feedback to improve the user experience.
