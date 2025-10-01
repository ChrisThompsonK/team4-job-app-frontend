import type { JobRole } from "../models/job-role.js";

export interface JobRoleService {
  getJobRoles(): JobRole[];
}
