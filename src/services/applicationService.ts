import axios, { type AxiosInstance } from "axios";
import type { Application, CreateApplicationRequest } from "../models/application.js";

/**
 * Service for managing job applications
 */
export class ApplicationService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL = process.env.API_BASE_URL || "http://localhost:8080") {
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  /**
   * Submit a new job application
   */
  async createApplication(applicationData: CreateApplicationRequest): Promise<Application> {
    try {
      const response = await this.axiosInstance.post("/api/applications", {
        ...applicationData,
        status: "in progress", // Set initial status
      });

      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to submit application");
      }
      throw error;
    }
  }

  /**
   * Get application by ID
   */
  async getApplicationById(id: number): Promise<Application> {
    try {
      const response = await this.axiosInstance.get(`/api/applications/${id}`);

      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`Application with ID ${id} not found`);
      }
      throw error;
    }
  }
}

// Export a default instance
export const applicationService = new ApplicationService();
