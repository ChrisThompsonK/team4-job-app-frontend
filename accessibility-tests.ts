/**
 * Pa11y Accessibility Testing Script
 *
 * This script runs accessibility tests against specified URLs using pa11y.
 * It can be run against localhost or any other environment.
 *
 * Usage:
 * - npm run test:a11y              # Run against localhost:3000 (default)
 * - npm run test:a11y:ci           # Run using pa11y-ci with .pa11yci.json config
 * - BASE_URL=http://staging.example.com npm run test:a11y  # Run against custom URL
 */

import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pa11y from "pa11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const SCREENSHOT_DIR = join(__dirname, "pa11y-screenshots");

// URLs to test - add more pages here as your application grows
const URLS_TO_TEST = [
  {
    url: "/",
    name: "Homepage",
  },
  {
    url: "/jobs",
    name: "Jobs Listing",
  },
  {
    url: "/jobs/create",
    name: "Create Job Form",
  },
  {
    url: "/login",
    name: "Login Page",
  },
  // Add more URLs here as you create new pages
  // {
  //   url: '/jobs/1',
  //   name: 'Job Detail Page',
  // },
  // {
  //   url: '/jobs/1/apply',
  //   name: 'Apply for Job Page',
  // },
];

// Pa11y configuration options
const pa11yOptions = {
  // Set the standard to test against (WCAG2A, WCAG2AA, WCAG2AAA)
  standard: "WCAG2AA" as const,

  // Wait time before running tests (allows dynamic content to load)
  wait: 1000,

  // Timeout for page load
  timeout: 10000,

  // Include notices in results (usually not needed)
  includeNotices: false,

  // Include warnings in results (usually not needed for CI)
  includeWarnings: false,

  // Test runners to use
  runners: ["axe", "htmlcs"],

  // Rules to ignore (add rule codes here if you need to skip specific rules)
  ignore: [
    // Example: 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail'
  ],
};

// Pa11y result issue interface (from @types/pa11y)
interface ResultIssue {
  code: string;
  context: string;
  message: string;
  selector: string;
  type: string;
  typeCode: number;
}

interface TestResult {
  url: string;
  name: string;
  passed: boolean;
  issues: number;
  errors?: ResultIssue[];
}

/**
 * Run accessibility test on a single URL
 */
async function testUrl(urlPath: string, name: string): Promise<TestResult> {
  const fullUrl = `${BASE_URL}${urlPath}`;
  const screenshotPath = join(SCREENSHOT_DIR, `${name.toLowerCase().replace(/\s+/g, "-")}.png`);

  try {
    console.log(`\n🔍 Testing: ${name} (${fullUrl})`);

    const results = await pa11y(fullUrl, {
      ...pa11yOptions,
      screenCapture: screenshotPath,
    });

    if (results.issues.length === 0) {
      console.log(`✅ ${name}: No accessibility issues found`);
      return {
        url: fullUrl,
        name,
        passed: true,
        issues: 0,
      };
    } else {
      console.log(`❌ ${name}: Found ${results.issues.length} accessibility issue(s)`);

      // Log each issue
      results.issues.forEach((issue: ResultIssue, index: number) => {
        console.log(`\n  Issue ${index + 1}:`);
        console.log(`    Type: ${issue.type}`);
        console.log(`    Code: ${issue.code}`);
        console.log(`    Message: ${issue.message}`);
        console.log(`    Context: ${issue.context}`);
        console.log(`    Selector: ${issue.selector}`);
      });

      return {
        url: fullUrl,
        name,
        passed: false,
        issues: results.issues.length,
        errors: results.issues,
      };
    }
  } catch (error) {
    console.error(`❌ ${name}: Test failed with error`);
    console.error(error);

    return {
      url: fullUrl,
      name,
      passed: false,
      issues: -1,
    };
  }
}

/**
 * Main function to run all accessibility tests
 */
async function runTests() {
  console.log("🚀 Starting Pa11y Accessibility Tests");
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`📊 Standard: WCAG 2.1 Level AA`);
  console.log(`📸 Screenshots will be saved to: ${SCREENSHOT_DIR}`);

  // Ensure screenshot directory exists
  try {
    await mkdir(SCREENSHOT_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create screenshot directory:", error);
  }

  const results: TestResult[] = [];

  // Run tests sequentially to avoid overwhelming the browser
  for (const { url, name } of URLS_TO_TEST) {
    const result = await testUrl(url, name);
    results.push(result);
  }

  // Summary
  console.log(`\n${"=".repeat(60)}`);
  console.log("📋 ACCESSIBILITY TEST SUMMARY");
  console.log("=".repeat(60));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalIssues = results.reduce((sum, r) => sum + Math.max(0, r.issues), 0);

  console.log(`\n✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  console.log(`🐛 Total Issues: ${totalIssues}`);

  if (failed > 0) {
    console.log("\n⚠️  Failed Tests:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  - ${r.name}: ${r.issues === -1 ? "Error" : `${r.issues} issue(s)`}`);
      });
  }

  console.log(`\n${"=".repeat(60)}`);

  // Exit with error code if tests failed
  if (failed > 0) {
    console.log("\n❌ Accessibility tests failed");
    process.exit(1);
  } else {
    console.log("\n✅ All accessibility tests passed!");
    process.exit(0);
  }
}

// Run the tests
runTests().catch((error) => {
  console.error("Failed to run accessibility tests:", error);
  process.exit(1);
});
