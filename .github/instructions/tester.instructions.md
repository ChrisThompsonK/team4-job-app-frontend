## Test Case ID
TC-xxx  <!-- Use unique ID, e.g. TC-001 -->

## Title
Short descriptive title (one line)

## Purpose
One-sentence reason for the test — what business value or functionality this verifies.

## Preconditions
- Environment: (e.g. Frontend running at http://localhost:3000, Backend at http://localhost:8000)
- Test accounts / roles required: (e.g. email=test+1@example.com, role=admin)
- DB / seed state required: (e.g. "seed jobs table with 2 open jobs", or "reset DB to test fixture")
- Any feature flags or toggles enabled:

## Test Data
- Field: value (example)
  - email: test+1@example.com
  - password: Password1!
  - applicantName: "Jane Tester"
- Notes about unique values, generator rules, or how to avoid collisions in CI.

## Steps
1. Go to /login
2. Enter email: `test+1@example.com`
3. Enter password: `Password1!`
4. Click button: `Login`
5. Navigate to /applications
6. Click button: `Export` (data-test="export-btn")
7. Wait for download to complete
(Include exact navigation and UI elements — prefer "Click button: Export" or "Click link: Settings".)

## Expected result
- CSV file is downloaded
- CSV header contains: `Applicant Name, Email Address, Job Title, Application Date`
- The downloaded file has 2 rows (matching seeded data)
- User is redirected to /applications after export (if applicable)

## Post-conditions / Cleanup
- What the test leaves behind (e.g., created user, uploaded file)
- Cleanup steps:
  - Delete created user via API: `DELETE /api/test/users/{id}`
  - Remove generated files from /tmp or uploads
  - Or use DB reset script: `scripts/reset-test-db.sh`

## Notes
- Flaky parts: file-downloads sometimes fail on CI runners due to ephemeral file system — add retries
- Timing considerations: allow up to 10s for export job to finish in slow CI environments
- Browser quirks: headless Chrome requires setting --no-sandbox in CI

## Automation notes
- Suggested selectors (prefer IDs or data attributes):
  - Login form: `#login-form` or `[data-test="login-form"]`
  - Email input: `#email` or `[data-test="email"]`
  - Password input: `#password` or `[data-test="password"]`
  - Export button: `[data-test="export-btn"]`
- If login should be done via API for speed/stability:
  - Endpoint: `POST /api/test/login` (body: { email, password })
  - Response: returns cookie `session` and JSON { userId, token }
  - How to set session in browser test: set cookie `session=<value>` or set `Authorization: Bearer <token>` header
- Idempotency: ensure the test can run repeatedly in CI (use unique test data, cleanup, or test-only endpoints)
- Timeouts / retries: recommend explicit waits for elements and a 3x retry for flaky backend tasks

## Metadata (optional)
- Priority: P0/P1/P2
- Owner: @team-member
- Estimated time: 2–5 minutes
- Related ticket(s): ISSUE-1234

## Version / History
- Author: Your Name
- Created: YYYY-MM-DD
- Last updated: YYYY-MM-DD