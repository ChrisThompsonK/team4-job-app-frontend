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

      // Log the response to see its structure
      console.log("API Response:", JSON.stringify(response.data, null, 2));

      // Handle different response formats
      const jobsData = Array.isArray(response.data) 
        ? response.data 
        : response.data.data || response.data.jobs || [];

      // Convert date strings to Date objects
      return jobsData.map((job: JobRole) => ({
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
      const response = await this.axiosInstance.get(`/api/jobs/${id}`);

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
}

// Export a default instance
export const jobService = new JobService();
