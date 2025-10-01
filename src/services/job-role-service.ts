import type { JobRole } from "../models/job-role.js";
import type { JobRoleService } from "./interfaces.js";

export class JobRoleServiceImpl implements JobRoleService {
  private jobRoles: JobRole[];

  constructor() {
    this.jobRoles = this.createSampleJobRoles();
  }

  getJobRoles(): JobRole[] {
    return this.jobRoles;
  }

  private createSampleJobRoles(): JobRole[] {
    return [
      {
        name: "Software Engineer",
        location: "London",
        capability: "Engineering",
        band: "Consultant",
        closingDate: new Date("2024-11-15"),
      },
      {
        name: "Senior Software Engineer",
        location: "Belfast",
        capability: "Engineering",
        band: "Senior Consultant",
        closingDate: new Date("2024-11-30"),
      },
      {
        name: "Principal Software Engineer",
        location: "Birmingham",
        capability: "Engineering",
        band: "Principal",
        closingDate: new Date("2024-12-10"),
      },
      {
        name: "Data Scientist",
        location: "Manchester",
        capability: "Data & Analytics",
        band: "Consultant",
        closingDate: new Date("2024-11-20"),
      },
      {
        name: "Senior Data Scientist",
        location: "Edinburgh",
        capability: "Data & Analytics",
        band: "Senior Consultant",
        closingDate: new Date("2024-12-05"),
      },
      {
        name: "DevOps Engineer",
        location: "Leeds",
        capability: "Platforms",
        band: "Consultant",
        closingDate: new Date("2024-11-25"),
      },
      {
        name: "Senior DevOps Engineer",
        location: "Glasgow",
        capability: "Platforms",
        band: "Senior Consultant",
        closingDate: new Date("2024-12-01"),
      },
      {
        name: "Business Analyst",
        location: "Bristol",
        capability: "Business Change",
        band: "Analyst",
        closingDate: new Date("2024-11-18"),
      },
      {
        name: "Senior Business Analyst",
        location: "Newcastle",
        capability: "Business Change",
        band: "Senior Analyst",
        closingDate: new Date("2024-12-03"),
      },
      {
        name: "UX Designer",
        location: "Cardiff",
        capability: "Experience Design",
        band: "Consultant",
        closingDate: new Date("2024-11-22"),
      },
    ];
  }
}
