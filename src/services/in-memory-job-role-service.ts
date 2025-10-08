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

  private createSampleJobRoles(): JobRole[] {
    return [
      {
        name: "Software Engineer",
        location: "London",
        capability: "Engineering",
        band: "Consultant",
        closingDate: new Date("2025-11-15"),
      },
      {
        name: "Senior Software Engineer",
        location: "Belfast",
        capability: "Engineering",
        band: "Senior Consultant",
        closingDate: new Date("2025-11-30"),
      },
      {
        name: "Principal Software Engineer",
        location: "Birmingham",
        capability: "Engineering",
        band: "Principal",
        closingDate: new Date("2025-12-10"),
      },
      {
        name: "Data Scientist",
        location: "Manchester",
        capability: "Data & Analytics",
        band: "Consultant",
        closingDate: new Date("2025-11-20"),
      },
      {
        name: "Senior Data Scientist",
        location: "Edinburgh",
        capability: "Data & Analytics",
        band: "Senior Consultant",
        closingDate: new Date("2025-12-05"),
      },
      {
        name: "DevOps Engineer",
        location: "Leeds",
        capability: "Platforms",
        band: "Consultant",
        closingDate: new Date("2025-11-25"),
      },
      {
        name: "Senior DevOps Engineer",
        location: "Glasgow",
        capability: "Platforms",
        band: "Senior Consultant",
        closingDate: new Date("2025-12-01"),
      },
      {
        name: "Business Analyst",
        location: "Bristol",
        capability: "Business Change",
        band: "Analyst",
        closingDate: new Date("2025-11-18"),
      },
      {
        name: "Senior Business Analyst",
        location: "Newcastle",
        capability: "Business Change",
        band: "Senior Analyst",
        closingDate: new Date("2025-12-03"),
      },
      {
        name: "UX Designer",
        location: "Cardiff",
        capability: "Experience Design",
        band: "Consultant",
        closingDate: new Date("2025-11-22"),
      },
      {
        name: "Frontend Developer",
        location: "London",
        capability: "Engineering",
        band: "Consultant",
        closingDate: new Date("2025-10-20"),
      },
      {
        name: "Backend Developer",
        location: "Belfast",
        capability: "Engineering",
        band: "Consultant",
        closingDate: new Date("2025-10-25"),
      },
      {
        name: "Full Stack Developer",
        location: "Manchester",
        capability: "Engineering",
        band: "Senior Consultant",
        closingDate: new Date("2025-11-05"),
      },
      {
        name: "Cloud Architect",
        location: "London",
        capability: "Platforms",
        band: "Principal",
        closingDate: new Date("2025-11-12"),
      },
      {
        name: "Security Engineer",
        location: "Edinburgh",
        capability: "Platforms",
        band: "Senior Consultant",
        closingDate: new Date("2025-10-30"),
      },
      {
        name: "Product Manager",
        location: "Birmingham",
        capability: "Business Change",
        band: "Manager",
        closingDate: new Date("2025-11-08"),
      },
      {
        name: "Scrum Master",
        location: "Leeds",
        capability: "Business Change",
        band: "Consultant",
        closingDate: new Date("2025-10-28"),
      },
      {
        name: "UI/UX Designer",
        location: "Bristol",
        capability: "Experience Design",
        band: "Senior Consultant",
        closingDate: new Date("2025-11-15"),
      },
      {
        name: "Data Engineer",
        location: "Glasgow",
        capability: "Data & Analytics",
        band: "Consultant",
        closingDate: new Date("2025-10-22"),
      },
      {
        name: "Machine Learning Engineer",
        location: "London",
        capability: "Data & Analytics",
        band: "Senior Consultant",
        closingDate: new Date("2025-11-28"),
      },
      {
        name: "Test Automation Engineer",
        location: "Belfast",
        capability: "Engineering",
        band: "Consultant",
        closingDate: new Date("2025-10-18"),
      },
      {
        name: "Site Reliability Engineer",
        location: "Manchester",
        capability: "Platforms",
        band: "Senior Consultant",
        closingDate: new Date("2025-11-10"),
      },
      {
        name: "Technical Lead",
        location: "London",
        capability: "Engineering",
        band: "Principal",
        closingDate: new Date("2025-12-01"),
      },
      {
        name: "Agile Coach",
        location: "Cardiff",
        capability: "Business Change",
        band: "Senior Consultant",
        closingDate: new Date("2025-11-20"),
      },
      {
        name: "Solutions Architect",
        location: "Edinburgh",
        capability: "Platforms",
        band: "Principal",
        closingDate: new Date("2025-12-05"),
      },
    ];
  }
}
