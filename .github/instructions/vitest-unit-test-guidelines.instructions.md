---
applyTo: '**'
---

# Vitest Unit Test Guidelines for LLMs

This document outlines the standards and best practices for creating Vitest unit tests in the **team4-job-app-frontend** project. All LLMs should follow these guidelines when creating new unit tests.

---

## Vitest Unit Tests

### Configuration

**File**: `vitest.config.ts`

```typescript
export default defineConfig({
  test: {
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    environment: "node",
    testTimeout: 10000,
    globals: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

### Test Structure

**File Location**: `src/services/myService.test.ts`

```typescript
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { MyService } from "./myService";

/**
 * Unit tests for MyService
 * Tests should be focused on business logic and edge cases
 */
describe("MyService", () => {
  let service: MyService;

  // Setup before each test
  beforeEach(() => {
    service = new MyService();
  });

  // Cleanup after each test
  afterEach(() => {
    // Reset state, clear mocks, etc.
  });

  describe("someMethod", () => {
    it("should return expected value for valid input", () => {
      // ARRANGE
      const input = "test-value";
      const expected = "expected-result";

      // ACT
      const result = service.someMethod(input);

      // ASSERT
      expect(result).toBe(expected);
    });

    it("should throw error for invalid input", () => {
      expect(() => {
        service.someMethod(null);
      }).toThrow();
    });

    it("should handle edge cases", () => {
      expect(service.someMethod("")).toBe("default-value");
      expect(service.someMethod("   ")).toBe("trimmed-value");
    });
  });
});
```

### Unit Test Best Practices

- **Test behavior, not implementation**: Focus on what the function should do, not how it does it
- **One assertion per test** (or related assertions): Keep tests focused
- **Use descriptive test names**: `should return user when ID exists` not `test get user`
- **Test edge cases**: null values, empty strings, boundary conditions
- **Keep tests fast**: Unit tests should run in milliseconds
- **Avoid test interdependencies**: Each test should be independent
- **Mock external dependencies**: Use `vi.mock()` for external services

---

## Best Practices

### AAA Pattern (Arrange, Act, Assert)

All tests should follow the AAA pattern:

```typescript
it("should calculate total price correctly", () => {
  // ARRANGE - Set up test data and initial state
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ];

  // ACT - Perform the action being tested
  const total = calculateTotal(items);

  // ASSERT - Verify the expected outcome
  expect(total).toBe(35);
});
```

---

## File Organization

### Directory Structure

```
team4-job-app-frontend/
├── src/
│   ├── services/
│   │   ├── jobService.ts
│   │   └── jobService.test.ts    # Unit test (colocated)
│   ├── controllers/
│   │   ├── formController.ts
│   │   └── formController.test.ts # Unit test (colocated)
│   └── utils.test.ts             # Utility tests
│
└── vitest.config.ts              # Vitest configuration
```

### Naming Conventions

- **Test Files**: `kebab-case.test.ts`
  - ✓ `job-service.test.ts`, `form-controller.test.ts`
  - ✗ `jobServiceTest.ts`, `form-controller-spec.ts`

- **Test Suites**: `PascalCase` matching the tested module
  - ✓ `describe("JobService", () => { ... })`
  - ✗ `describe("job service tests", () => { ... })`

- **Test Cases**: Descriptive sentences
  - ✓ `it("should return user when ID exists", () => { ... })`
  - ✗ `it("test get user", () => { ... })`

---

## Running Tests

### Vitest Unit Tests

```bash
# Run all unit tests
npm run test

# Run specific test file
npm run test src/services/jobService.test.ts

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Common Patterns

### Testing Synchronous Functions

```typescript
describe("calculateTotal", () => {
  it("should return sum of all item prices", () => {
    const items = [
      { price: 10, quantity: 1 },
      { price: 20, quantity: 2 }
    ];

    const result = calculateTotal(items);

    expect(result).toBe(50);
  });

  it("should return 0 for empty array", () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

### Testing Asynchronous Functions

```typescript
describe("fetchUserData", () => {
  it("should return user data for valid ID", async () => {
    const userId = 123;

    const result = await fetchUserData(userId);

    expect(result).toEqual({ id: 123, name: "John" });
  });

  it("should throw error for invalid ID", async () => {
    await expect(fetchUserData(-1)).rejects.toThrow();
  });
});
```

### Testing Error Handling

```typescript
describe("validateEmail", () => {
  it("should throw error for invalid email", () => {
    expect(() => {
      validateEmail("invalid-email");
    }).toThrow("Invalid email format");
  });

  it("should return true for valid email", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });
});
```

### Using Mocks

```typescript
import { vi } from "vitest";

describe("UserService", () => {
  it("should call API with correct parameters", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ data: "test" });
    const service = new UserService(mockFetch);

    await service.getUser(123);

    expect(mockFetch).toHaveBeenCalledWith("/users/123");
  });
});
```

---

## Checklist for New Tests

- [ ] Test has a clear, descriptive name
- [ ] Test follows AAA pattern (Arrange, Act, Assert)
- [ ] Test is colocated with source file
- [ ] Test is organized in appropriate `describe()` block
- [ ] Tests are focused on behavior, not implementation
- [ ] Edge cases are tested (null, empty, boundary conditions)
- [ ] External dependencies are mocked
- [ ] Tests are fast (milliseconds)
- [ ] Tests are independent
- [ ] Error cases are tested
- [ ] Comments explain complex test logic
- [ ] Test runs successfully and is reliable

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://vitest.dev/guide/best-practices)
