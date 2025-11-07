/**
 * Test helpers - Utility functions for generating test data
 */

/**
 * Generates a unique email address for testing using a timestamp
 * @returns A unique email address in the format testuser{timestamp}@example.com
 */
export function generateUniqueEmail(): string {
  const timestamp = Date.now();
  return `testuser${timestamp}@example.com`;
}
