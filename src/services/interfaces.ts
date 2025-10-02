import type { JobRole } from "../models/job-role.js";
import type { JobDescription } from "../models/job-description.js";

export interface JobRoleService {
  getJobRoles(): JobRole[];
  getJobRoleById(id: string): JobRole | undefined;
  getJobDescriptionById(id: string): JobDescription | undefined;
}
