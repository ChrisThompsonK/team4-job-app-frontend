import type { JobRole } from "../models/job-role.js";

export interface JobRoleService {
  getJobRoles(): JobRole[];
  getJobRoleById(id: number): JobRole | undefined;
  getAllJobs(): Promise<JobRole[]>;
  getJobById(id: number): Promise<JobRole>;
  setBaseURL(baseURL: string): void;
  getBaseURL(): string | undefined;
}
