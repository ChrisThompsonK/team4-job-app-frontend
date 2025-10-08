import axios, { type AxiosInstance } from "axios";
import type { JobRole } from "../models/job-role.js";
import type { JobRoleService } from "./interfaces.js";

/**
 * Simple API Service for fetching jobs
 */
export class JobService implements JobRoleService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL = process.env.API_BASE_URL || "http://localhost:8080") {
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  /**
   * Get all jobs from the API
   */
  async getAllJobs(): Promise<JobRole[]> {
    try {
      const response = await this.axiosInstance.get("/api/jobs");

      // Axios only returns 2xx status codes here, so we know it's successful
      // Extract data from the API response wrapper
      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data.data || response.data.jobs || [];

      // Convert date strings to Date objects
      return jobsData.map((job: JobRole) => ({
        ...job,
        closingDate: new Date(job.closingDate),
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Jobs endpoint not found");
        }
        // Re-throw with HTTP status information
        throw new Error(`HTTP ${error.response?.status}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get a specific job by ID
   */
  async getJobById(id: number): Promise<JobRole> {
    try {
      const response = await this.axiosInstance.get(`/api/jobs/${id}`);

      // Axios only returns 2xx status codes here, so we know it's successful
      // Extract job data from the API response wrapper
      const jobData = response.data.data || response.data;

      console.log("Fetched job data:", jobData);

      // Convert date string to Date object
      return {
        ...jobData,
        closingDate: new Date(jobData.closingDate),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Job with ID ${id} not found`);
        }
        // Re-throw with HTTP status information
        throw new Error(`HTTP ${error.response?.status}: ${error.message}`);
      }
      throw error;
    }
  }
}

// Export a default instance
export const jobService = new JobService();
