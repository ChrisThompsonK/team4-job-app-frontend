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

      // Extract job data from the response wrapper
      const jobData = response.data.job || response.data;

      // Convert date string to Date object
      return {
        ...jobData,
        closingDate: new Date(jobData.closingDate),
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`Job with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Create a new job role
   */
  async createJob(jobData: Omit<JobRole, "id">): Promise<JobRole> {
    try {
      const response = await this.axiosInstance.post("/api/jobs", {
        ...jobData,
        closingDate:
          jobData.closingDate instanceof Date
            ? jobData.closingDate.toISOString().split("T")[0]
            : jobData.closingDate,
      });

      // Extract job data from the response
      const createdJob = response.data.data || response.data;

      // Convert date string to Date object
      return {
        ...createdJob,
        closingDate: new Date(createdJob.closingDate),
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }
}

// Export a default instance
export const jobService = new JobService();
