import type { JobRole } from "../models/job-role.js";

export interface JobRoleService {
  getAllJobs(limit?: number, offset?: number): Promise<JobRole[]>;
  getJobById(id: number): Promise<JobRole>;
  createJob(jobData: Omit<JobRole, "id">): Promise<JobRole>;
  getJobsWithPagination(
    limit?: number,
    offset?: number
  ): Promise<{ jobs: JobRole[]; total: number }>;
}
