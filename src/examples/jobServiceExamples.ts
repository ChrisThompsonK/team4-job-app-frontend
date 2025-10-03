/**
 * Example usage of the JobService API module
 * This demonstrates how to use the new API service in your application
 */

import { JobService, jobService } from "./services/jobService.js";
import type { JobRole } from "./models/job-role.js";

// Example 1: Using the default service instance
export async function fetchAllJobsExample(): Promise<void> {
  try {
    console.log("Fetching all jobs...");
    const jobs: JobRole[] = await jobService.getAllJobs();
    console.log(`Found ${jobs.length} jobs:`);
    jobs.forEach(job => {
      console.log(`- ${job.name} in ${job.location} (${job.status})`);
    });
  } catch (error) {
    console.error("Error fetching jobs:", error instanceof Error ? error.message : error);
  }
}

// Example 2: Fetching a specific job by ID
export async function fetchJobByIdExample(jobId: number): Promise<void> {
  try {
    console.log(`Fetching job with ID ${jobId}...`);
    const job: JobRole = await jobService.getJobById(jobId);
    console.log(`Found job: ${job.name}`);
    console.log(`Location: ${job.location}`);
    console.log(`Band: ${job.band}`);
    console.log(`Closing Date: ${job.closingDate.toDateString()}`);
    console.log(`Open Positions: ${job.numberOfOpenPositions}`);
    console.log(`Summary: ${job.summary}`);
  } catch (error) {
    console.error(`Error fetching job ${jobId}:`, error instanceof Error ? error.message : error);
  }
}

// Example 3: Creating a custom service instance with different configuration
export async function useCustomServiceExample(): Promise<void> {
  const customService = new JobService("https://api.example.com/v1");
  
  try {
    const jobs = await customService.getAllJobs();
    console.log(`Custom service found ${jobs.length} jobs`);
  } catch (error) {
    console.error("Custom service error:", error instanceof Error ? error.message : error);
  }
}

// Example 4: Handling different error scenarios
export async function errorHandlingExample(): Promise<void> {
  try {
    // This will likely fail if the API is not running
    await jobService.getJobById(999999);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        console.log("Job was not found - this is expected");
      } else if (error.message.includes("timeout")) {
        console.log("Request timed out - server might be slow");
      } else if (error.message.includes("Server error")) {
        console.log("Server is having issues");
      } else {
        console.log("Unknown error occurred:", error.message);
      }
    }
  }
}

// Example 5: Using with async/await in a React-like component pattern
export async function loadJobsForComponent(setJobs: (jobs: JobRole[]) => void, setLoading: (loading: boolean) => void): Promise<void> {
  setLoading(true);
  
  try {
    const jobs = await jobService.getAllJobs();
    setJobs(jobs);
  } catch (error) {
    console.error("Failed to load jobs:", error);
    setJobs([]); // Set empty array on error
  } finally {
    setLoading(false);
  }
}

// Example 6: Updating the base URL dynamically
export function configureApiEndpoint(environment: "development" | "production" | "testing"): void {
  const baseUrls = {
    development: "/api",
    production: "https://prod-api.example.com/api",
    testing: "https://test-api.example.com/api"
  };
  
  jobService.setBaseURL(baseUrls[environment]);
  console.log(`API endpoint configured for ${environment}: ${jobService.getBaseURL()}`);
}

// Example usage in main application
export async function runExamples(): Promise<void> {
  console.log("=== JobService API Examples ===");
  
  // Configure for development
  configureApiEndpoint("development");
  
  // Example 1: Fetch all jobs
  await fetchAllJobsExample();
  
  // Example 2: Fetch specific job
  await fetchJobByIdExample(1);
  
  // Example 4: Error handling
  await errorHandlingExample();
  
  console.log("=== Examples completed ===");
}