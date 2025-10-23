import type { Application, CreateApplicationRequest } from "../models/application.js";

interface BackendApplication {
  id: number;
  userId: number;
  jobRoleId: number;
  cvText: string;
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
  }

  async getAllApplications(): Promise<Application[]> {
    // This would require a backend endpoint - not currently available
    throw new Error("Getting all applications is not supported");
  }

  async getApplicationById(id: number): Promise<Application> {
    const response = await fetch(`${this.apiBaseUrl}/api/applications/${id}`);

    if (!response.ok) {
      throw new Error(`Application with id ${id} not found`);
    }

    const result = await response.json();
    return this.mapBackendToFrontend(result.data);
  }

  async getApplicationsByJobId(jobId: number): Promise<Application[]> {
    const response = await fetch(`${this.apiBaseUrl}/api/applications/job/${jobId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch applications for job ${jobId}`);
    }

    const result = await response.json();
    return result.data.map((app: BackendApplication) => this.mapBackendToFrontend(app));
  }

  async getApplicationsByUserId(userId: number): Promise<Application[]> {
    const response = await fetch(`${this.apiBaseUrl}/api/applications/user/${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch applications for user ${userId}`);
    }

    const result = await response.json();
    return result.data.map((app: BackendApplication) => this.mapBackendToFrontend(app));
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
    const response = await fetch(`${this.apiBaseUrl}/api/applications/user/${userId}/job/${jobId}`);
    if (response.status === 404) {
      throw new Error("Application not found");
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch application for user ${userId} and job ${jobId}`);
    }
    const result = await response.json();
    return this.mapBackendToFrontend(result.data);
  }
  async createApplication(applicationData: CreateApplicationRequest): Promise<Application> {
    // Map frontend data to backend format
    const backendData = {
      userId: applicationData.userId,
      jobRoleId: applicationData.jobId,
      cvText: applicationData.coverLetter || "",
    };

    const response = await fetch(`${this.apiBaseUrl}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      const errorText = await response.text();

      let errorMessage: string;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || "Failed to create application";
      } catch {
        errorMessage = errorText || "Failed to create application";
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    // Use the original application data from the frontend for user details
    // since the backend response doesn't include user name and email
    return this.mapBackendToFrontendWithUserData(result.data, applicationData);
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

    const response = await fetch(`${this.apiBaseUrl}/api/applications/${id}/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notes }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update application status`);
    }

    const result = await response.json();
    return this.mapBackendToFrontend(result.data);
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

    return {
      id: backendApp.id,
      jobId: backendApp.jobRoleId,
      applicantName: applicantName,
      email: email,
      phoneNumber: backendApp.phoneNumber || "",
      coverLetter: backendApp.cvText,
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
      coverLetter: backendApp.cvText,
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
