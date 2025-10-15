# Authentication Setup Documentation

## Overview

This document describes the authentication system implemented in the job application frontend. The system provides secure user authentication with session management and role-based access control.

## Features

- **User Authentication**: Login with username/password
- **Session Management**: Server-side sessions with Express-session
- **Role-Based Access Control**: Support for "member" and "admin" roles
- **Protected Routes**: Middleware to protect sensitive areas
- **Backend Integration**: Seamless integration with backend API

## Backend API Requirements

The frontend expects the backend to provide the following authentication endpoints:

### POST /api/auth/login
**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "member", // or "admin"
      "createdAt": "2025-01-01T00:00:00Z"
    },
    "token": "optional-jwt-token"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

### GET /api/auth/me
Validates current session/token and returns user information.

**Headers:**
```
Authorization: Bearer <token> (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "member",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### POST /api/auth/logout
Invalidates the current session/token.

## Test Accounts

For testing, ensure your backend has these accounts:

1. **Member Account:**
   - Username: `member`
   - Password: `password123`
   - Role: `member`

2. **Admin Account:**
   - Username: `admin`
   - Password: `admin123`
   - Role: `admin`

## Frontend Implementation

### Models
- `User`: User interface with id, username, email, role, createdAt
- `LoginRequest`: Login form data
- `LoginResponse`: API response format

### Services
- `AuthService`: Handles authentication API calls
  - `login(credentials)`: Authenticate user
  - `validateSession(token)`: Validate current session
  - `logout()`: End user session

### Controllers
- `AuthController`: Handles authentication routes
  - `showLogin`: Display login form
  - `login`: Process login form
  - `logout`: Handle logout

### Middleware
- `requireAuth`: Protect routes requiring authentication
- `requireAdmin`: Protect routes requiring admin role
- `addUserToLocals`: Add user info to all templates

### Protected Routes

**Requires Authentication:**
- `/jobs/:id/apply` - Job application form
- `/jobs/:id/apply/success` - Application success page

**Requires Admin Role:**
- `/jobs/create` - Create new job
- `/jobs/:id/applications` - View applications for job
- `/jobs/:id/applications/:applicationId` - View specific application

## Session Configuration

Sessions are configured with:
- **Secret**: Set via `SESSION_SECRET` environment variable
- **Duration**: 24 hours
- **Security**: HttpOnly cookies, secure in production

## Environment Variables

```bash
# Backend API URL
API_BASE_URL=http://localhost:3001

# Frontend port
PORT=3000

# Session secret (change in production!)
SESSION_SECRET=your-secret-key-change-in-production
```

## UI Features

### Header Navigation
- Shows login button when not authenticated
- Shows username and logout button when authenticated
- Shows admin badge for admin users
- Responsive mobile menu

### Job Cards
- "Login to Apply" button for unauthenticated users
- "Apply Now" button for authenticated users
- "View Applications" button for admins

### Authentication Flow
1. User clicks "Login" or protected action
2. Redirected to login page
3. After successful login, redirected to intended page
4. Session maintained until logout or expiry

## Error Handling

The system handles various error scenarios:
- Invalid credentials
- Missing form fields
- Network errors
- Session expiry
- Unauthorized access

Error messages are displayed using query parameters and rendered in templates.

## Testing

Run the authentication tests:
```bash
npm test authService.test.ts
```

The tests cover:
- Successful login
- Invalid credentials
- Missing fields
- Session validation
- Logout functionality

## Security Considerations

1. **Session Secret**: Use a strong, unique secret in production
2. **HTTPS**: Enable secure cookies in production
3. **CSRF Protection**: Consider adding CSRF middleware
4. **Rate Limiting**: Implement login rate limiting
5. **Input Validation**: Validate all user inputs

## Troubleshooting

### Common Issues

1. **Login fails with valid credentials**
   - Check backend API is running
   - Verify API_BASE_URL is correct
   - Check backend authentication endpoints

2. **Session not persisting**
   - Verify SESSION_SECRET is set
   - Check cookie settings
   - Ensure backend responds correctly

3. **Admin features not showing**
   - Confirm user role is "admin"
   - Check middleware is applied to routes

### Debug Tips

- Check browser console for errors
- Verify network requests in developer tools
- Check server logs for authentication errors
- Ensure proper error handling in templates

## Next Steps

Potential enhancements:
1. Add password reset functionality
2. Implement "Remember Me" feature
3. Add user registration
4. Enhance security with 2FA
5. Add audit logging