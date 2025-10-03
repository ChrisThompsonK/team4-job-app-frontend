# Job API Service Module

This module provides a dedicated interface for handling job-related API calls using Axios in the frontend application.

## Features

- ✅ Axios-based HTTP client with configurable base URL
- ✅ Automatic timeout handling (10 seconds)
- ✅ Comprehensive error handling with specific error messages
- ✅ Request/Response interceptors for logging and debugging
- ✅ TypeScript support with proper type definitions
- ✅ Date object transformation (converts API date strings to Date objects)
- ✅ Default service instance for convenience
- ✅ Unit tests included

## Installation

Axios has been added to the project dependencies. To install it:

```bash
npm install axios
```

## Usage

### Import the Service

```typescript
import { JobService, jobService } from './services/jobService.js';
import type { JobRole } from './models/job-role.js';
```

### Basic Usage with Default Instance

```typescript
// Get all jobs
const jobs: JobRole[] = await jobService.getAllJobs();

// Get specific job by ID
const job: JobRole = await jobService.getJobById(1);
```

### Custom Service Instance

```typescript
// Create custom instance with different base URL
const customService = new JobService('https://api.example.com/v1');
const jobs = await customService.getAllJobs();
```

### Configuration

```typescript
// Update base URL
jobService.setBaseURL('/api/v2');

// Get current base URL
const currentUrl = jobService.getBaseURL();
```

## API Methods

### `getAllJobs(): Promise<JobRole[]>`

Retrieves all jobs from the `/api/jobs` endpoint.

**Returns:** Promise resolving to an array of JobRole objects

**Throws:**
- `"Jobs endpoint not found"` - When API returns 404
- `"Server error while fetching jobs"` - When API returns 500
- `"Request timeout while fetching jobs"` - When request times out
- Generic error message for other failures

### `getJobById(id: number): Promise<JobRole>`

Retrieves a specific job by ID from the `/api/jobs/:id` endpoint.

**Parameters:**
- `id` (number) - The job ID to retrieve

**Returns:** Promise resolving to a JobRole object

**Throws:**
- `"Job with ID {id} not found"` - When job doesn't exist (404)
- `"Invalid job ID: {id}"` - When ID format is invalid (400)
- `"Server error while fetching job details"` - When API returns 500
- `"Request timeout while fetching job details"` - When request times out
- Generic error message for other failures

### `setBaseURL(baseURL: string): void`

Updates the base URL for API requests.

**Parameters:**
- `baseURL` (string) - The new base URL

### `getBaseURL(): string | undefined`

Gets the current base URL.

**Returns:** The current base URL or undefined

## Error Handling

The service includes comprehensive error handling:

```typescript
try {
  const jobs = await jobService.getAllJobs();
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
    // Handle specific errors based on message content
  }
}
```

## Configuration Options

The service is configured with the following defaults:

- **Base URL:** `/api`
- **Timeout:** 10 seconds
- **Content-Type:** `application/json`
- **Request/Response logging:** Enabled for debugging

## Integration with Existing Services

The new API service complements the existing `InMemoryJobRoleService` and implements the `ApiJobRoleService` interface defined in `src/services/interfaces.ts`.

You can switch between different service implementations:

```typescript
// In-memory service (for development/testing)
import { InMemoryJobRoleService } from './services/in-memory-job-role-service.js';
const memoryService = new InMemoryJobRoleService();

// API service (for production)
import { jobService } from './services/jobService.js';
```

## Testing

Unit tests are included in `src/services/jobService.test.ts`. Run tests with:

```bash
npm test
```

## Examples

See `src/examples/jobServiceExamples.ts` for comprehensive usage examples including:

- Basic API calls
- Error handling patterns
- Custom configuration
- Integration patterns
- Environment-specific setup

## File Structure

```
src/
├── services/
│   ├── jobService.ts          # Main API service implementation
│   ├── jobService.test.ts     # Unit tests
│   └── interfaces.ts          # Updated with ApiJobRoleService interface
├── examples/
│   └── jobServiceExamples.ts  # Usage examples
└── models/
    └── job-role.ts           # JobRole type definitions
```

## Future Enhancements

Potential improvements for the service:

- Request caching
- Retry logic for failed requests
- Request cancellation support
- Pagination support
- Authentication token handling
- Request queuing for rate limiting