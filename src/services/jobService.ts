import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { JobRole } from "../models/job-role.js";

/**
 * API Service for handling job-related HTTP requests
 */
export class JobService {
  private apiClient: AxiosInstance;

  constructor(baseURL = "/api") {
    this.apiClient = axios.create({
      baseURL,
      timeout: 10000, // 10 seconds timeout
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor for logging (optional)
    this.apiClient.interceptors.request.use(
      (config) => {
        console.log(`Making request to: ${config.url}`);
        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error.message);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Retrieve the list of jobs from the /api/jobs endpoint
   * @returns Promise<JobRole[]> - Array of job roles
   * @throws Error when the request fails
   */
  async getAllJobs(): Promise<JobRole[]> {
    try {
      const response: AxiosResponse<JobRole[]> = await this.apiClient.get("/jobs");
      
      // Transform dates from strings to Date objects
      const jobsWithDates = response.data.map(job => ({
        ...job,
        closingDate: new Date(job.closingDate),
      }));
      
      return jobsWithDates;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Jobs endpoint not found");
        }
        if (error.response?.status === 500) {
          throw new Error("Server error while fetching jobs");
        }
        if (error.code === "ECONNABORTED") {
          throw new Error("Request timeout while fetching jobs");
        }
      }
      throw new Error(`Failed to fetch jobs: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Retrieve job details from the /api/jobs/:id endpoint
   * @param id - The ID of the job to retrieve
   * @returns Promise<JobRole> - The job role details
   * @throws Error when the request fails or job is not found
   */
  async getJobById(id: number): Promise<JobRole> {
    try {
      const response: AxiosResponse<JobRole> = await this.apiClient.get(`/jobs/${id}`);
      
      // Transform date from string to Date object
      const jobWithDate = {
        ...response.data,
        closingDate: new Date(response.data.closingDate),
      };
      
      return jobWithDate;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Job with ID ${id} not found`);
        }
        if (error.response?.status === 400) {
          throw new Error(`Invalid job ID: ${id}`);
        }
        if (error.response?.status === 500) {
          throw new Error("Server error while fetching job details");
        }
        if (error.code === "ECONNABORTED") {
          throw new Error("Request timeout while fetching job details");
        }
      }
      throw new Error(`Failed to fetch job with ID ${id}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Update the base URL for the API client
   * @param baseURL - The new base URL
   */
  setBaseURL(baseURL: string): void {
    this.apiClient.defaults.baseURL = baseURL;
  }

  /**
   * Get the current base URL
   * @returns The current base URL
   */
  getBaseURL(): string | undefined {
    return this.apiClient.defaults.baseURL;
  }
}

// Export a default instance for convenience
export const jobService = new JobService();