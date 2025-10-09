import type { Application, CreateApplicationRequest } from "../models/application.js";

export class ApplicationService {
  private applications: Application[] = [];
  private nextId = 1;

  constructor() {
    // Initialize with some sample applications for demonstration
    this.applications = this.createSampleApplications();
  }

  async getAllApplications(): Promise<Application[]> {
    return [...this.applications];
  }

  async getApplicationById(id: number): Promise<Application> {
    const application = this.applications.find((app) => app.id === id);
    if (!application) {
      throw new Error(`Application with id ${id} not found`);
    }
    return application;
  }

  async getApplicationsByJobId(jobId: number): Promise<Application[]> {
    return this.applications.filter((app) => app.jobId === jobId);
  }

  async createApplication(applicationData: CreateApplicationRequest): Promise<Application> {
    const newApplication: Application = {
      id: this.nextId++,
      ...applicationData,
      applicationDate: new Date(),
      status: "pending",
    };

    this.applications.push(newApplication);
    return newApplication;
  }

  async updateApplicationStatus(
    id: number,
    status: Application["status"],
    notes?: string
  ): Promise<Application> {
    const application = await this.getApplicationById(id);
    application.status = status;
    if (notes) {
      application.notes = notes;
    }
    return application;
  }

  async deleteApplication(id: number): Promise<void> {
    const index = this.applications.findIndex((app) => app.id === id);
    if (index === -1) {
      throw new Error(`Application with id ${id} not found`);
    }
    this.applications.splice(index, 1);
  }

  private createSampleApplications(): Application[] {
    return [
      {
        id: 1,
        jobId: 1,
        applicantName: "John Doe",
        email: "john.doe@email.com",
        phoneNumber: "07712345678",
        coverLetter: "I am very interested in this Software Engineering role...",
        applicationDate: new Date("2024-12-01"),
        status: "pending",
      },
      {
        id: 2,
        jobId: 1,
        applicantName: "Jane Smith",
        email: "jane.smith@email.com",
        phoneNumber: "07787654321",
        coverLetter: "As an experienced developer, I would love to contribute...",
        applicationDate: new Date("2024-12-02"),
        status: "reviewed",
      },
      {
        id: 3,
        jobId: 3,
        applicantName: "Mike Johnson",
        email: "mike.johnson@email.com",
        phoneNumber: "07798765432",
        coverLetter: "I have extensive experience in data analysis...",
        applicationDate: new Date("2024-12-03"),
        status: "accepted",
      },
    ];
  }
}
