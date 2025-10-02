import { type JobDescription, jobDescriptions } from "../models/job-description.js";
import type { JobRole } from "../models/job-role.js";
import type { JobRoleService } from "./interfaces.js";

export class InMemoryJobRoleService implements JobRoleService {
  private jobRoles: JobRole[];

  constructor() {
    this.jobRoles = this.createSampleJobRoles();
  }

  getJobRoles(): JobRole[] {
    return this.jobRoles;
  }

  getJobRoleById(id: string): JobRole | undefined {
    return this.jobRoles.find((job) => job.id === id);
  }

  getJobDescriptionById(id: string): JobDescription | undefined {
    const jobRole = this.getJobRoleById(id);
    if (!jobRole) return undefined;

    return jobDescriptions.find((desc) => desc.jobTitle === jobRole.name);
  }

  private createSampleJobRoles(): JobRole[] {
    return [
      {
        id: "software-engineer",
        name: "Software Engineer",
        location: "London",
        capability: "Engineering",
        band: "Consultant",
        closingDate: new Date("2024-11-15"),
      },
      {
        id: "senior-software-engineer",
        name: "Senior Software Engineer",
        location: "Belfast",
        capability: "Engineering",
        band: "Senior Consultant",
        closingDate: new Date("2024-11-30"),
      },
      {
        id: "principal-software-engineer",
        name: "Principal Software Engineer",
        location: "Birmingham",
        capability: "Engineering",
        band: "Principal",
        closingDate: new Date("2024-12-10"),
      },
      {
        id: "data-scientist",
        name: "Data Scientist",
        location: "Manchester",
        capability: "Data & Analytics",
        band: "Consultant",
        closingDate: new Date("2024-11-20"),
      },
      {
        id: "senior-data-scientist",
        name: "Senior Data Scientist",
        location: "Edinburgh",
        capability: "Data & Analytics",
        band: "Senior Consultant",
        closingDate: new Date("2024-12-05"),
      },
      {
        id: "devops-engineer",
        name: "DevOps Engineer",
        location: "Leeds",
        capability: "Platforms",
        band: "Consultant",
        closingDate: new Date("2024-11-25"),
      },
      {
        id: "senior-devops-engineer",
        name: "Senior DevOps Engineer",
        location: "Glasgow",
        capability: "Platforms",
        band: "Senior Consultant",
        closingDate: new Date("2024-12-01"),
      },
      {
        id: "business-analyst",
        name: "Business Analyst",
        location: "Bristol",
        capability: "Business Change",
        band: "Analyst",
        closingDate: new Date("2024-11-18"),
      },
      {
        id: "senior-business-analyst",
        name: "Senior Business Analyst",
        location: "Newcastle",
        capability: "Business Change",
        band: "Senior Analyst",
        closingDate: new Date("2024-12-03"),
      },
      {
        id: "ux-designer",
        name: "UX Designer",
        location: "Cardiff",
        capability: "Experience Design",
        band: "Consultant",
        closingDate: new Date("2024-11-22"),
      },
    ];
  }
}
