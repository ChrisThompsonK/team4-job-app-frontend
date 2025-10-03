import axios from "axios";
import type { JobRole } from "../models/job-role.js";
import type { JobRoleService } from "./interfaces.js";

/**
 * Simple API Service for fetching jobs
 */
export class JobService implements JobRoleService {
  private baseURL: string;

  constructor(baseURL = "/api") {
    this.baseURL = baseURL;
  }

  /**
   * Get all jobs from the API
   */
  async getAllJobs(): Promise<JobRole[]> {
    const response = await axios.get(`${this.baseURL}/jobs`);

    // Convert date strings to Date objects
    return response.data.map((job: JobRole) => ({
      ...job,
      closingDate: new Date(job.closingDate),
    }));
  }

  /**
   * Get a specific job by ID
   */
  async getJobById(id: number): Promise<JobRole> {
    const response = await axios.get(`${this.baseURL}/jobs/${id}`);

    // Convert date string to Date object
    return {
      ...response.data,
      closingDate: new Date(response.data.closingDate),
    };
  }

  /**
   * Set the base URL for the API
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  /**
   * Get the current base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Synchronous methods not supported - use async versions instead
   */
  getJobRoles(): JobRole[] {
    throw new Error("Use getAllJobs() instead");
  }

  getJobRoleById(_id: number): JobRole | undefined {
    throw new Error("Use getJobById() instead");
  }
}

// Export a default instance
export const jobService = new JobService();
