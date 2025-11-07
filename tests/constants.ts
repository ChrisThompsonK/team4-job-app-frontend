/**
 * Test constants - Shared configuration values for Playwright tests
 */

export const TEST_TIMEOUTS = {
  /** Default timeout for element selection (5 seconds) */
  DEFAULT: 5000,
  /** Short timeout for quick operations (2 seconds) */
  SHORT: 2000,
  /** Long timeout for slow operations (10 seconds) */
  LONG: 10000,
} as const;

export const BASE_URL = "http://localhost:3000" as const;
