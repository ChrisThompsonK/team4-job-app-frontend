import axios, { type AxiosInstance } from "axios";
import type { JobRole } from "../models/job-role.js";
import type { JobRoleService } from "./interfaces.js";

/**
 * Simple API Service for fetching jobs
 */
export class JobService implements JobRoleService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL = "/api") {
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  /**
   * Get all jobs from the API
   */
  async getAllJobs(): Promise<JobRole[]> {
    try {
      const response = await this.axiosInstance.get("/jobs");

      // Convert date strings to Date objects
      return response.data.map((job: JobRole) => ({
        ...job,
        closingDate: new Date(job.closingDate),
      }));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error("Jobs endpoint not found");
      }
      throw error;
    }
  }

  /**
   * Get a specific job by ID
   */
  async getJobById(id: number): Promise<JobRole> {
    try {
      const response = await this.axiosInstance.get(`/jobs/${id}`);

      // Convert date string to Date object
      return {
        ...response.data,
        closingDate: new Date(response.data.closingDate),
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`Job with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Set the base URL for the API
   */
  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  /**
   * Get the current base URL
   */
  getBaseURL(): string {
    return this.axiosInstance.defaults.baseURL || "";
  }
}

// Export a default instance
export const jobService = new JobService();
