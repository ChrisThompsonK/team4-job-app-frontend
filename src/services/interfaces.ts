import type { JobRole } from "../models/job-role.js";
import type { LoginRequest, LoginResponse, User } from "../models/user.js";

export interface JobRoleService {
  getAllJobs(limit?: number, offset?: number): Promise<JobRole[]>;
  getJobById(id: number): Promise<JobRole>;
  createJob(jobData: Omit<JobRole, "id">): Promise<JobRole>;
  updateJob(id: number, jobData: Omit<JobRole, "id">): Promise<JobRole>;
  deleteJob(id: number): Promise<void>;
  getJobsWithPagination(
    limit?: number,
    offset?: number
  ): Promise<{ jobs: JobRole[]; total: number }>;
}

export interface AuthenticationService {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
  validateSession(token?: string): Promise<User | null>;
}
