import axios from "axios";
import FormData from "form-data";
import type { Application, CreateApplicationRequest } from "../models/application.js";

interface BackendApplication {
  id: number;
  userId: number;
  jobRoleId: number;
  cvFileName?: string;
  cvFilePath?: string;
  cvFileType?: string;
  cvFileSize?: number;
  cvText?: string; // Legacy field for backward compatibility
  status: string;
  createdAt: string;
  applicantName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export class ApplicationService {
  private apiBaseUrl: string;

  constructor(apiBaseUrl?: string) {
    this.apiBaseUrl = apiBaseUrl || process.env.API_BASE_URL || "http://localhost:8080";
    console.log('ApplicationService initialized with API_BASE_URL:', this.apiBaseUrl);
  }

  async getAllApplications(): Promise<Application[]> {
    // This would require a backend endpoint - not currently available
    throw new Error("Getting all applications is not supported");
  }

  async getApplicationById(id: number): Promise<Application> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/api/applications/${id}`);
      return this.mapBackendToFrontend(response.data.data);
    } catch (_error) {
      throw new Error(`Application with id ${id} not found`);
    }
  }

  async getApplicationsByJobId(jobId: number): Promise<Application[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/api/applications/job/${jobId}`);
      return response.data.data.map((app: BackendApplication) => this.mapBackendToFrontend(app));
    } catch (_error) {
      throw new Error(`Failed to fetch applications for job ${jobId}`);
    }
  }

  async getApplicationsByUserId(userId: number): Promise<Application[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/api/applications/user/${userId}`);
      return response.data.data.map((app: BackendApplication) => this.mapBackendToFrontend(app));
    } catch (_error) {
      throw new Error(`Failed to fetch applications for user ${userId}`);
    }
  }

  /**
   * Checks if a user has applied for a specific job by querying the backend directly.
   * Returns true if an application exists, false otherwise.
   */
  async hasUserAppliedForJob(userId: number, jobId: number): Promise<boolean> {
    try {
      const application = await this.getApplicationByUserIdAndJobId(userId, jobId);
      return !!application;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "Application not found") {
        return false;
      }
      throw error;
    }
  }

  /**
   * Fetches an application by userId and jobId.
   * Throws an error if not found or on other errors.
   */
  async getApplicationByUserIdAndJobId(userId: number, jobId: number): Promise<Application> {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/api/applications/user/${userId}/job/${jobId}`
      );
      return this.mapBackendToFrontend(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error("Application not found");
      }
      throw new Error(`Failed to fetch application for user ${userId} and job ${jobId}`);
    }
  }
  async createApplication(applicationData: CreateApplicationRequest): Promise<Application> {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("userId", applicationData.userId?.toString() || "");
    formData.append("jobRoleId", applicationData.jobId.toString());

    // Add the CV file if present
    if (applicationData.cvFile) {
      // Append the file buffer directly to form-data
      formData.append("cvFile", applicationData.cvFile.buffer, {
        filename: applicationData.cvFile.originalname,
        contentType: applicationData.cvFile.mimetype,
      });
    }

    try {
      const response = await axios.post(`${this.apiBaseUrl}/api/applications`, formData, {
        headers: formData.getHeaders(),
      });

      // Use the original application data from the frontend for user details
      // since the backend response doesn't include user name and email
      return this.mapBackendToFrontendWithUserData(response.data.data, applicationData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "Failed to create application";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to create application");
    }
  }

  async updateApplicationStatus(
    id: number,
    status: Application["status"],
    notes?: string
  ): Promise<Application> {
    // Map frontend status to backend status
    let endpoint = "";
    if (status === "accepted") {
      endpoint = "hire";
    } else if (status === "rejected") {
      endpoint = "reject";
    } else {
      throw new Error(`Status ${status} cannot be updated via API`);
    }

    try {
      const response = await axios.put(`${this.apiBaseUrl}/api/applications/${id}/${endpoint}`, {
        notes,
      });
      return this.mapBackendToFrontend(response.data.data);
    } catch (_error) {
      throw new Error(`Failed to update application status`);
    }
  }

  async deleteApplication(_id: number): Promise<void> {
    throw new Error("Deleting applications is not supported");
  }

  // Helper method to map backend application to frontend format
  private mapBackendToFrontend(backendApp: BackendApplication): Application {
    // Determine applicant name from backend data
    let applicantName: string;
    if (backendApp.applicantName) {
      applicantName = backendApp.applicantName;
    } else if (backendApp.firstName && backendApp.lastName) {
      applicantName = `${backendApp.firstName} ${backendApp.lastName}`;
    } else {
      throw new Error("Cannot determine applicant name from backend data");
    }

    const email = backendApp.email || "unknown@example.com";
    
    const cvUrl = backendApp.cvFilePath
      ? `${this.apiBaseUrl}/${backendApp.cvFilePath}`
      : backendApp.cvText || undefined;
    
    console.log('Mapping application:', {
      id: backendApp.id,
      cvFilePath: backendApp.cvFilePath,
      apiBaseUrl: this.apiBaseUrl,
      constructedUrl: cvUrl
    });

    return {
      id: backendApp.id,
      jobId: backendApp.jobRoleId,
      applicantName: applicantName,
      email: email,
      phoneNumber: backendApp.phoneNumber || "",
      cvUrl: cvUrl,
      cvFileName: backendApp.cvFileName || undefined,
      applicationDate: new Date(backendApp.createdAt),
      status: this.mapBackendStatus(backendApp.status),
      userId: backendApp.userId,
    };
  }

  // Helper method to map backend application to frontend format using frontend user data
  private mapBackendToFrontendWithUserData(
    backendApp: BackendApplication,
    frontendData: CreateApplicationRequest
  ): Application {
    return {
      id: backendApp.id,
      jobId: backendApp.jobRoleId,
      applicantName: frontendData.applicantName, // Use the name from frontend
      email: frontendData.email, // Use the email from frontend
      phoneNumber: frontendData.phoneNumber || "",
      cvUrl: backendApp.cvFilePath
        ? `${this.apiBaseUrl}/${backendApp.cvFilePath}`
        : backendApp.cvText || undefined,
      cvFileName: backendApp.cvFileName || frontendData.cvFile?.originalname || undefined,
      applicationDate: new Date(backendApp.createdAt),
      status: this.mapBackendStatus(backendApp.status),
      userId: backendApp.userId,
    };
  }

  // Map backend status to frontend status
  private mapBackendStatus(backendStatus: string): Application["status"] {
    switch (backendStatus) {
      case "in progress":
        return "pending";
      case "hired":
        return "accepted";
      case "rejected":
        return "rejected";
      default:
        return "pending";
    }
  }
}
