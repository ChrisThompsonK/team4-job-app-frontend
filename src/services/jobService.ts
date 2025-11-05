import axios, { type AxiosInstance } from "axios";
import type { JobRole } from "../models/job-role.js";
import type { JobRoleService } from "./interfaces.js";

/**
 * Simple API Service for fetching jobs
 */
export class JobService implements JobRoleService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL = process.env.API_BASE_URL || "http://localhost:8080") {
    console.log("JobService constructor - API_BASE_URL:", process.env.API_BASE_URL);
    console.log("JobService constructor - baseURL being used:", baseURL);
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  /**
   * Get all jobs from the API
   */
  async getAllJobs(limit?: number, offset?: number): Promise<JobRole[]> {
    try {
      const params = new URLSearchParams();
      if (limit !== undefined) {
        params.append("limit", limit.toString());
      }
      if (offset !== undefined) {
        params.append("offset", offset.toString());
      }

      const url = `/api/jobs${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await this.axiosInstance.get(url);

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
   * Get jobs with pagination info
   */
  async getJobsWithPagination(
    limit?: number,
    offset?: number,
    search?: string,
    filters?: { location?: string; capability?: string; band?: string }
  ): Promise<{ jobs: JobRole[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (limit !== undefined) {
        params.append("limit", limit.toString());
      }
      if (offset !== undefined) {
        params.append("offset", offset.toString());
      }
      if (search?.trim()) {
        params.append("search", search.trim());
      }
      if (filters?.location?.trim()) {
        params.append("location", filters.location.trim());
      }
      if (filters?.capability?.trim()) {
        params.append("capability", filters.capability.trim());
      }
      if (filters?.band?.trim()) {
        params.append("band", filters.band.trim());
      }

      const url = `/api/jobs${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await this.axiosInstance.get(url);

      // Handle different response formats
      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data.data || response.data.jobs || [];

      const total = response.data.total || jobsData.length;

      // Convert date strings to Date objects
      const jobs = jobsData.map((job: JobRole) => ({
        ...job,
        closingDate: new Date(job.closingDate),
      }));

      return { jobs, total };
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
      const createdJob = response.data;

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

  /**
   * Update an existing job role
   */
  async updateJob(id: number, jobData: Omit<JobRole, "id">): Promise<JobRole> {
    try {
      const response = await this.axiosInstance.put(`/api/jobs/${id}`, {
        ...jobData,
        closingDate:
          jobData.closingDate instanceof Date
            ? jobData.closingDate.toISOString().split("T")[0]
            : jobData.closingDate,
      });

      // Extract job data from the response
      const updatedJob = response.data;

      // Convert date string to Date object
      return {
        ...updatedJob,
        closingDate: new Date(updatedJob.closingDate),
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`Job with ID ${id} not found`);
      }
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Delete a job role
   */
  async deleteJob(id: number): Promise<void> {
    try {
      await this.axiosInstance.delete(`/api/jobs/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`Job with ID ${id} not found`);
      }
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }
}

// Note: Default instance removed to avoid early instantiation before env vars are loaded
