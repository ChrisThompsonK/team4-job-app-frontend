# User Authentication Integration - Frontend Implementation

## Overview

Implemented user authentication and automatic job application form population for logged-in users. This removes the need for users to manually enter their name and email when applying for jobs.

## Changes Made

### 1. **Updated Job Application Form** (`views/apply.njk`)

#### Before:
- All users had to enter name and email manually
- Form fields were always required

#### After:
- **Logged-in users**: Name and email fields are hidden and auto-populated
- **Guest users**: Still see and must fill name/email fields
- Phone number pre-filled for logged-in users if available
- User info display shows who is applying

```nunjucks
{% if user %}
    <!-- User Info Display -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="user-check" class="h-5 w-5 text-blue-600 mr-2"></i>
            <div>
                <p class="text-sm font-medium text-blue-800">Applying as:</p>
                <p class="text-blue-700">{{ user.name }} ({{ user.email }})</p>
            </div>
        </div>
    </div>
{% endif %}
```

### 2. **Enhanced Application Controller** (`src/controllers/application-controller.ts`)

#### New Features:
- **User detection**: Checks if user is logged in from session
- **Auto-population**: Uses user data for name/email if available
- **Flexible validation**: Only validates name/email for guest users
- **User ID tracking**: Includes userId in application record

```typescript
// Get applicant details - either from logged-in user or form submission
if (user) {
    // User is logged in - use their information
    finalApplicantName = user.name;
    finalEmail = user.email;
} else {
    // User is not logged in - use form data
    finalApplicantName = applicantName;
    finalEmail = email;
    
    // Validate required fields for non-logged-in users only
    if (!applicantName || !email) {
        res.redirect(`/jobs/${jobId}/apply?error=missing-fields`);
        return;
    }
}
```

### 3. **Updated Application Model** (`src/models/application.ts`)

#### Added Optional User ID:
```typescript
export interface Application {
    // ... existing fields
    userId?: number; // ID of the logged-in user who submitted the application
}

export interface CreateApplicationRequest {
    // ... existing fields
    userId?: number; // ID of the logged-in user who submitted the application
}
```

### 4. **Enhanced Header Navigation** (`views/partials/header.njk`)

#### Desktop Navigation:
- **Guest users**: See "Login" button
- **Logged-in users**: See user dropdown with:
  - User name display
  - Profile link
  - My Applications link
  - Logout option

#### Mobile Navigation:
- **Guest users**: Login button in menu
- **Logged-in users**: User info display and navigation options

```nunjucks
{% if user %}
    <!-- User is logged in -->
    <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost rounded-btn flex items-center gap-2">
            <i data-lucide="user" class="h-5 w-5"></i>
            <span class="hidden lg:block">{{ user.name }}</span>
            <i data-lucide="chevron-down" class="h-4 w-4"></i>
        </div>
        <ul tabindex="0" class="menu dropdown-content z-[1] p-2 shadow bg-white rounded-box w-52 mt-2 border border-gray-200">
            <!-- User menu items -->
        </ul>
    </div>
{% else %}
    <!-- User is not logged in -->
    <a href="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 !text-white">
        Login
    </a>
{% endif %}
```

### 5. **Session Management** (`src/index.ts`)

#### Added Dependencies:
```bash
npm install express-session @types/express-session
```

#### Session Configuration:
```typescript
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware to make user available in all templates
app.use((req, res, next) => {
  res.locals.user = (req as any).session?.user || null;
  next();
});
```

### 6. **Authentication Routes**

#### Login Routes:
```typescript
// Show login form
app.get("/login", (req, res) => { /* ... */ });

// Process login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  if (username && password) {
    // Mock user data - in production, validate against real database/API
    const mockUser = {
      id: 1,
      name: username === "admin" ? "John Doe" : username,
      email: username === "admin" ? "john.doe@kainos.com" : `${username}@kainos.com`,
      phoneNumber: "+44 7900 123456",
      role: username === "admin" ? "admin" : "user"
    };
    
    (req as any).session.user = mockUser;
    res.redirect("/jobs");
  } else {
    res.redirect("/login?error=invalid-credentials");
  }
});

// Logout
app.get("/logout", (req, res) => {
  (req as any).session.destroy((err) => {
    if (err) console.error("Error destroying session:", err);
    res.redirect("/");
  });
});
```

#### Protected Routes:
```typescript
// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if ((req as any).session?.user) {
    (req as any).user = (req as any).session.user;
    next();
  } else {
    res.redirect("/login");
  }
};

// Protected routes
app.get("/profile", requireAuth, (req, res) => { /* ... */ });
app.get("/my-applications", requireAuth, (req, res) => { /* ... */ });
```

### 7. **Enhanced Login Form** (`views/login.njk`)

#### Added Features:
- **Error handling**: Shows validation messages
- **Form submission**: POST to `/login` endpoint
- **Responsive design**: Professional styling

```nunjucks
<!-- Error Messages -->
{% if error %}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        <div class="flex items-center">
            <i data-lucide="alert-circle" class="h-5 w-5 mr-2"></i>
            <span>
                {% if error == 'invalid-credentials' %}
                    Invalid username or password. Please try again.
                {% else %}
                    {{ error }}
                {% endif %}
            </span>
        </div>
    </div>
{% endif %}

<!-- Login Form -->
<form method="POST" action="/login" class="space-y-6">
    <!-- Username and password fields -->
</form>
```

### 8. **New User Pages**

#### Profile Page (`views/profile.njk`):
- Displays user information
- Links to applications and job browsing
- Clean, professional design

#### My Applications Page (`views/my-applications.njk`):
- Lists user's job applications
- Shows application status
- Empty state for new users
- Links back to job browsing

## User Experience Flow

### For Guest Users (Not Logged In):
1. **Browse Jobs** → Same as before
2. **Apply for Job** → Must enter name and email
3. **Submit Application** → Creates application with form data

### For Logged-In Users:
1. **Login** → Enter username/password
2. **Browse Jobs** → See user name in header
3. **Apply for Job** → Name/email auto-filled, form simplified
4. **Submit Application** → Creates application with user data
5. **View Applications** → Access via user dropdown

## Mock Authentication

**Current Implementation** (for development):
- Any username/password combination works
- Special case: `username: "admin"` → "John Doe" user
- Other usernames → Use the username as the display name
- Email auto-generated: `username@kainos.com`

**Example Users**:
- `admin` / `any_password` → John Doe (john.doe@kainos.com)
- `jane.smith` / `any_password` → jane.smith (jane.smith@kainos.com)

## Security Considerations

### Current State (Development):
- Mock authentication for testing
- Session storage in memory
- No password validation

### Production Ready Requirements:
1. **Real Authentication**: Integrate with backend API/database
2. **Password Security**: Hash passwords, validate securely
3. **Session Storage**: Use Redis or database for sessions
4. **HTTPS**: Secure session cookies
5. **Rate Limiting**: Prevent brute force attacks
6. **CSRF Protection**: Add CSRF tokens to forms

## Backend Integration Points

### What Backend Needs to Support:
1. **User Authentication API**: 
   - `POST /auth/login` - Validate credentials
   - `POST /auth/logout` - Invalidate session
   - `GET /auth/me` - Get current user info

2. **Application Creation with User ID**:
   - Update application model to include `userId`
   - Link applications to user accounts
   - Support both authenticated and guest applications

3. **User Management**:
   - User profiles and information
   - Application history per user
   - Role-based permissions

## Testing the Implementation

### Test Cases:

1. **Guest User Application**:
   - Visit `/jobs/1/apply` without logging in
   - Should see name/email fields
   - Must fill all required fields

2. **Logged-In User Application**:
   - Login with any username/password
   - Visit `/jobs/1/apply`
   - Should see user info display
   - Name/email fields hidden
   - Phone pre-filled if available

3. **Navigation**:
   - Guest: See "Login" button
   - Logged-in: See user dropdown with name
   - Test mobile menu variations

4. **Authentication Flow**:
   - Login → Redirect to jobs
   - Logout → Destroy session, redirect to home
   - Protected routes → Redirect to login if not authenticated

## Future Enhancements

1. **Password Reset**: Forgot password functionality
2. **Registration**: New user account creation
3. **Profile Editing**: Update user information
4. **Application Management**: Edit/withdraw applications
5. **Notifications**: Email updates on application status
6. **CV Upload**: File upload with applications
7. **Application History**: Detailed tracking and analytics

---

**Status**: ✅ Complete and Ready for Testing  
**Authentication**: Mock (Development Only)  
**User Experience**: Significantly Improved  
**Backward Compatibility**: Maintained for Guest Users