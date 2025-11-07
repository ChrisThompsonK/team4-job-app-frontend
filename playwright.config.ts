import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for exploratory testing
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: [
    ["html"], // Generate HTML report
    ["list"], // Show test results in console
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "edge",
      use: {
        channel: "msedge", // runs the installed Microsoft Edge
        ...devices["Desktop Chrome"], // reuse Desktop Chrome viewport / UA
      },
    },
  ],
});
