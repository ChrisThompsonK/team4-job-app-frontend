import type { JobRole } from "../models/job-role.js";

export interface JobRoleService {
  getAllJobs(): Promise<JobRole[]>;
  getJobById(id: number): Promise<JobRole>;
  createJob(jobData: Omit<JobRole, 'id'>): Promise<JobRole>;
}
